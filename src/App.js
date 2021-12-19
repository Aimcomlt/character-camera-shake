import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Stage, CameraShake, useAnimations } from '@react-three/drei'

// Handling controls in Threejs is hard bc 3rd party components that change the camera need to know
// about controls, or else all changes are overwritten. That is the case for both <Stage and <CameraShake.
// In latest R3F controls can be set as the default so that other parts of the app may react to it.
// By setting <OrbitControls makeDefault <Stage and <CameraShake are aware of the controls being used.
// Should your own components rely on default controls, throughout the three they're available as:
//   const controls = useThree(state => state.controls)

useGLTF.preload('/robot.gltf')
function Model(props) {
  const { scene, animations } = useGLTF('/robot-draco.glb')
  const { actions } = useAnimations(animations, scene)
  useEffect(() => {
    actions.Idle.play()
    scene.traverse((obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true))
  }, [actions, scene])
  return <primitive object={scene} {...props} />
}

export default function Viewer() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <Stage contactShadowOpacity={1}>
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls makeDefault />
      <CameraShake yawFrequency={0.05} rollFrequency={0.2} pitchFrequency={0.1} />
    </Canvas>
  )
}
