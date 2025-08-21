import { Html } from '@react-three/drei';

interface LabelProps {
  position: [number, number, number];
  text: string;
}

export default function Label({ position, text }: LabelProps) {
  return (
    <Html position={position} center>
      <div style={{
        color: 'white',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '3px 6px',
        borderRadius: '5px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        transform: 'translate(-50%, -50%)', // Center the label on the anchor point
      }}>
        {text}
      </div>
    </Html>
  );
}
