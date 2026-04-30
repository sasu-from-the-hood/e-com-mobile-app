export function LoadingSpinner() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  )
}
