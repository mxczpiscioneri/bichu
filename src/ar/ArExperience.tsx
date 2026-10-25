import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import { mediaFor } from '@/content/media';
import type { Animal } from '@/domain/animal';

import { useArStore } from './arStore';
import { clampScale, initialScale, sizeModeFor } from './scale';
import type { ViroModule } from './viro';

/**
 * Minimal AR scene (spike): detect a horizontal plane, tap to place ONE
 * animal, then rotate / pinch-scale / drag it. No walking, eating or physics.
 * Gameplay lives in the 2D overlay rendered by the screen, not in here.
 */
function createScene(viro: ViroModule, animal: Animal) {
  const model = mediaFor(animal.id).model3d;
  const meta = animal.media.model3dMeta;
  const baseScale = initialScale(meta);

  return function BichuArScene() {
    const setStatus = useArStore((state) => state.setStatus);
    const [scale, setScale] = useState(baseScale);
    const [rotationY, setRotationY] = useState(0);
    const gestureBase = useRef({ scale: baseScale, rotation: 0 });
    const setSizeMode = useArStore((state) => state.setSizeMode);
    useEffect(() => setSizeMode(sizeModeFor(scale, meta)), [scale, setSizeMode]);
    // ViroReact 3 no longer lets the plane selector discover planes on its own:
    // the scene must forward its anchor events to it, otherwise no surface is
    // ever found and the animal can never be placed (empty camera).
    const selectorRef = useRef<InstanceType<ViroModule['ViroARPlaneSelector']>>(null);

    return (
      <viro.ViroARScene
        anchorDetectionTypes={['PlanesHorizontal']}
        onAnchorFound={(anchor) => selectorRef.current?.handleAnchorFound(anchor)}
        onAnchorUpdated={(anchor) => selectorRef.current?.handleAnchorUpdated(anchor)}
        onAnchorRemoved={(anchor) => anchor && selectorRef.current?.handleAnchorRemoved(anchor)}
        onTrackingUpdated={(state) => {
          if (state === viro.ViroTrackingStateConstants.TRACKING_NORMAL) {
            const current = useArStore.getState().status;
            if (current === 'starting') setStatus('searching');
          }
        }}>
        <viro.ViroAmbientLight color="#ffffff" intensity={250} />
        <viro.ViroDirectionalLight color="#ffffff" direction={[0, -1, -0.3]} castsShadow />
        <viro.ViroARPlaneSelector
          ref={selectorRef}
          alignment="Horizontal"
          minHeight={0.25}
          minWidth={0.25}
          onPlaneDetected={() => {
            if (useArStore.getState().status !== 'placed') setStatus('surfaceFound');
            return true;
          }}
          onPlaneSelected={() => setStatus('placed')}>
          {model !== null ? (
            <viro.ViroNode position={[0, meta?.groundOffset ?? 0, 0]} dragType="FixedToPlane" onDrag={() => undefined}>
              <viro.Viro3DObject
                source={model}
                type="GLB"
                scale={[scale, scale, scale]}
                rotation={[0, rotationY, 0]}
                onError={() => setStatus('error')}
                onPinch={(pinchState, factor) => {
                  const next = clampScale(gestureBase.current.scale * factor, meta);
                  setScale(next);
                  if (pinchState === viro.ViroPinchStateTypes.PINCH_END) gestureBase.current.scale = next;
                }}
                onRotate={(rotateState, factor) => {
                  const next = gestureBase.current.rotation - factor;
                  setRotationY(next);
                  if (rotateState === viro.ViroRotateStateTypes.ROTATE_END) gestureBase.current.rotation = next;
                }}
              />
            </viro.ViroNode>
          ) : null}
        </viro.ViroARPlaneSelector>
      </viro.ViroARScene>
    );
  };
}

export function ArExperience({ viro, animal }: { viro: ViroModule; animal: Animal }) {
  const scene = useMemo(() => createScene(viro, animal), [viro, animal]);
  return <viro.ViroARSceneNavigator autofocus initialScene={{ scene }} style={StyleSheet.absoluteFill} />;
}
