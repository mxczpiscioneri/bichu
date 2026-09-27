import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import type { Animal, Habitat } from '@/domain/animal';

/**
 * Flat vector landscapes drawn in-house (no external art). They match the flat
 * style of the legacy animal illustrations and scale to any container.
 */
export type SceneName = 'savanna' | 'forest' | 'ocean' | 'farm' | 'home' | 'mountains' | 'wetland';

const SCENE_BY_HABITAT: Record<Habitat, SceneName> = {
  savanna: 'savanna',
  grassland: 'savanna',
  desert: 'savanna',
  forest: 'forest',
  mixed: 'forest',
  mountains: 'mountains',
  ocean: 'ocean',
  coast: 'ocean',
  freshwater: 'wetland',
  wetland: 'wetland',
  farm: 'farm',
  home: 'home',
  urban: 'home',
};

export function sceneForHabitat(habitat: Habitat): SceneName {
  return SCENE_BY_HABITAT[habitat];
}

export function sceneForAnimal(animal: Animal): SceneName {
  return sceneForHabitat(animal.habitats.find((h) => h !== 'mixed') ?? animal.habitats[0]);
}

function Sky({ id, top, bottom }: { id: string; top: string; bottom: string }) {
  return (
    <>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={bottom} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={400} height={300} fill={`url(#${id})`} />
    </>
  );
}

function Acacia({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path
        d="M-3 0 L-2 -38 L-14 -52 M-2 -38 L10 -54 M-2 -30 L3 -44"
        stroke="#6B4A2B"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <Ellipse cx={-4} cy={-58} rx={34} ry={9} fill="#7C8F3B" />
      <Ellipse cx={8} cy={-54} rx={22} ry={6} fill="#8FA347" />
    </G>
  );
}

function Tree({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Rect x={-3} y={-22} width={6} height={24} rx={3} fill="#6B4A2B" />
      <Circle cx={0} cy={-38} r={20} fill={color} />
      <Circle cx={-12} cy={-28} r={14} fill={color} />
      <Circle cx={12} cy={-28} r={14} fill={color} />
    </G>
  );
}

function Savanna() {
  return (
    <>
      <Sky id="sv" top="#FCE7B2" bottom="#F7C979" />
      <Circle cx={318} cy={78} r={34} fill="#FFF4C9" opacity={0.9} />
      <Path d="M0 190 Q100 160 200 182 T400 172 V300 H0z" fill="#EDB566" />
      <Path d="M0 222 Q120 200 240 216 T400 208 V300 H0z" fill="#DDA04C" />
      <Acacia x={70} y={196} s={1.1} />
      <Acacia x={332} y={186} s={0.8} />
      <Path d="M0 256 Q200 236 400 252 V300 H0z" fill="#C98A3C" />
      <Path
        d="M40 262 l5 -14 l4 14 M300 270 l5 -12 l4 12 M210 280 l4 -10 l4 10"
        stroke="#9E6B2C"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function Forest() {
  return (
    <>
      <Sky id="fo" top="#DDF0CF" bottom="#B4DA98" />
      <Tree x={40} y={170} s={1.3} color="#9CC97F" />
      <Tree x={150} y={160} s={1.1} color="#9CC97F" />
      <Tree x={280} y={168} s={1.4} color="#9CC97F" />
      <Tree x={380} y={160} s={1.2} color="#9CC97F" />
      <Path d="M0 190 Q100 172 200 186 T400 180 V300 H0z" fill="#7DB35F" />
      <Tree x={-6} y={230} s={1.7} color="#5E9447" />
      <Tree x={110} y={222} s={1.3} color="#6FA653" />
      <Tree x={350} y={232} s={1.8} color="#5E9447" />
      <Path d="M0 240 Q200 222 400 238 V300 H0z" fill="#4F8A3C" />
      <Path d="M0 268 Q200 252 400 266 V300 H0z" fill="#3F7A35" />
    </>
  );
}

function Ocean() {
  return (
    <>
      <Sky id="oc" top="#DDF4F8" bottom="#A6DFEC" />
      <Circle cx={80} cy={70} r={26} fill="#FFF6D2" />
      <Path d="M0 170 H400 V300 H0z" fill="#56BCCB" />
      <Path
        d="M0 190 Q25 180 50 190 T100 190 T150 190 T200 190 T250 190 T300 190 T350 190 T400 190 V300 H0z"
        fill="#3FA6BA"
      />
      <Path d="M0 232 Q30 220 60 232 T120 232 T180 232 T240 232 T300 232 T360 232 T420 232 V300 H0z" fill="#2B8FA6" />
      <Path
        d="M30 206 q10 -6 20 0 M250 214 q10 -6 20 0 M150 258 q10 -6 20 0"
        stroke="#DDF4F8"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function Farm() {
  return (
    <>
      <Sky id="fa" top="#E3F4FB" bottom="#BFE5F4" />
      <Circle cx={330} cy={64} r={24} fill="#FFF4C9" />
      <Path d="M0 180 Q120 140 240 172 T400 160 V300 H0z" fill="#A9D46F" />
      <G transform="translate(282 150)">
        <Path d="M0 30 L0 0 L28 -22 L56 0 L56 30z" fill="#D94A2B" />
        <Path d="M-4 2 L28 -26 L60 2" stroke="#FBF5E8" strokeWidth={5} strokeLinejoin="round" fill="none" />
        <Rect x={19} y={8} width={18} height={22} fill="#FBF5E8" />
      </G>
      <Path d="M0 214 Q200 190 400 210 V300 H0z" fill="#8BC057" />
      <G stroke="#FBF5E8" strokeWidth={5} strokeLinecap="round">
        <Path d="M10 238 H190 M10 252 H190" />
        <Path d="M20 228 V262 M60 226 V262 M100 226 V262 M140 226 V262 M180 228 V262" />
      </G>
      <Path d="M0 262 Q200 248 400 260 V300 H0z" fill="#72A845" />
    </>
  );
}

function Home() {
  return (
    <>
      <Rect x={0} y={0} width={400} height={300} fill="#FCE7D6" />
      <Rect x={250} y={40} width={110} height={100} rx={12} fill="#CDEBF7" stroke="#F4D2B7" strokeWidth={8} />
      <Path d="M305 44 V136 M254 90 H356" stroke="#F4D2B7" strokeWidth={6} />
      <Rect x={0} y={206} width={400} height={94} fill="#E8B98C" />
      <Path d="M0 206 H400" stroke="#D9A274" strokeWidth={4} />
      <Ellipse cx={170} cy={262} rx={120} ry={22} fill="#F5C45D" opacity={0.8} />
      <G transform="translate(58 206)">
        <Path d="M-16 0 L16 0 L12 -30 L-12 -30z" fill="#D94A2B" />
        <Ellipse cx={-10} cy={-44} rx={10} ry={18} fill="#6F9F52" />
        <Ellipse cx={10} cy={-46} rx={9} ry={20} fill="#5E9447" />
        <Ellipse cx={0} cy={-56} rx={9} ry={20} fill="#7DB35F" />
      </G>
    </>
  );
}

function Mountains() {
  return (
    <>
      <Sky id="mo" top="#E4F2FA" bottom="#C3E0EE" />
      <Path d="M-20 220 L90 80 L200 220z" fill="#9AA7B4" />
      <Path d="M90 80 L60 118 L78 112 L92 124 L108 110 L120 118z" fill="#FFFFFF" />
      <Path d="M140 220 L270 60 L400 220z" fill="#8494A3" />
      <Path d="M270 60 L234 104 L254 98 L272 112 L290 98 L306 104z" fill="#FFFFFF" />
      <Path d="M0 210 Q200 188 400 206 V300 H0z" fill="#8DBE63" />
      <Tree x={60} y={250} s={0.9} color="#5E9447" />
      <Tree x={350} y={246} s={1} color="#5E9447" />
      <Path d="M0 258 Q200 240 400 256 V300 H0z" fill="#6FA653" />
    </>
  );
}

function Wetland() {
  return (
    <>
      <Sky id="we" top="#E3F4EE" bottom="#BFE3D6" />
      <Path d="M0 170 Q200 150 400 168 V300 H0z" fill="#8CC06A" />
      <Ellipse cx={200} cy={240} rx={230} ry={52} fill="#7FCAD6" />
      <Ellipse cx={140} cy={236} rx={22} ry={7} fill="#5E9447" />
      <Ellipse cx={262} cy={252} rx={18} ry={6} fill="#5E9447" />
      <Circle cx={266} cy={248} r={4} fill="#F7B6C8" />
      <G stroke="#5E7F3A" strokeWidth={4} strokeLinecap="round">
        <Path d="M30 230 V170 M44 234 V160 M58 230 V178 M350 232 V168 M366 236 V160" />
      </G>
      <G fill="#8A5A2B">
        <Rect x={40} y={150} width={8} height={22} rx={4} />
        <Rect x={362} y={150} width={8} height={22} rx={4} />
      </G>
    </>
  );
}

const SCENES: Record<SceneName, () => React.JSX.Element> = {
  savanna: Savanna,
  forest: Forest,
  ocean: Ocean,
  farm: Farm,
  home: Home,
  mountains: Mountains,
  wetland: Wetland,
};

interface HabitatSceneProps {
  scene: SceneName;
  style?: StyleProp<ViewStyle>;
}

/** Fills its container (absolute) with a landscape; place content on top. */
export function HabitatScene({ scene, style }: HabitatSceneProps) {
  const Scene = SCENES[scene];
  return (
    <View style={[StyleSheet.absoluteFill, styles.passThrough, style]} importantForAccessibility="no-hide-descendants">
      <Svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <Scene />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  passThrough: { pointerEvents: 'none' },
});
