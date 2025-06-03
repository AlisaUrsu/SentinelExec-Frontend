'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/nav-bar';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = ['/auth/login', '/auth/signup'].includes(pathname);
  const hideShader = pathname === '/';

  return (
    <>
      {!hideNavbar && <NavBar />}
        {!hideShader &&
        <ShaderGradientCanvas
            style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            }}
            lazyLoad={false}
            pixelDensity={1}
            pointerEvents="none"
        >
            <ShaderGradient
            animate="off"
            type="waterPlane"
            shader="defaults"
            uTime={0.2}
            uSpeed={0.1}
            uStrength={2.4}
            uDensity={1.1}
            uFrequency={5.5}
            uAmplitude={0}
            positionX={-0.5}
            positionY={0.1}
            positionZ={0}
            rotationX={0}
            rotationY={0}
            rotationZ={235}
            color1="#ad67ea"
            color2="#ea5c1a"
            color3="#000000"
            reflection={0.1}
            cAzimuthAngle={180}
            cPolarAngle={115}
            cDistance={3.9}
            cameraZoom={1}
            lightType="3d"
            brightness={1.2}
            envPreset="city"
            grain="on"
            toggleAxis={false}
            zoomOut={false}
            hoverState=""
            enableTransition={false}
            />
        </ShaderGradientCanvas>
        }
      {children}
    </>
  );
}
