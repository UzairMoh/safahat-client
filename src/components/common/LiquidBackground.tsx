import { useRef, useEffect } from 'react';
import { useSpring, animated, useSpringValue } from '@react-spring/web';

const LiquidBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const blob1X = useSpringValue(20);
    const blob1Y = useSpringValue(30);
    const blob2X = useSpringValue(70);
    const blob2Y = useSpringValue(60);
    const blob3X = useSpringValue(40);
    const blob3Y = useSpringValue(80);
    const blob4X = useSpringValue(80);
    const blob4Y = useSpringValue(20);

    const { gradientPosition } = useSpring({
        from: { gradientPosition: 0 },
        to: { gradientPosition: 100 },
        config: { duration: 20000 },
        loop: { reverse: true }
    });

    useEffect(() => {
        const animateBlobs = () => {
            blob1X.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 40 + 10); // 10-50%
                        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
                    }
                },
                config: { tension: 50, friction: 100 }
            });

            blob1Y.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 40 + 20); // 20-60%
                        await new Promise(resolve => setTimeout(resolve, 4000 + Math.random() * 2000));
                    }
                },
                config: { tension: 60, friction: 120 }
            });

            blob2X.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 30 + 60); // 60-90%
                        await new Promise(resolve => setTimeout(resolve, 4500 + Math.random() * 2000));
                    }
                },
                config: { tension: 40, friction: 90 }
            });

            blob2Y.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 40 + 40); // 40-80%
                        await new Promise(resolve => setTimeout(resolve, 3500 + Math.random() * 2000));
                    }
                },
                config: { tension: 45, friction: 110 }
            });

            blob3X.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 60 + 20); // 20-80%
                        await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 3000));
                    }
                },
                config: { tension: 30, friction: 140 }
            });

            blob3Y.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 30 + 70); // 70-100%
                        await new Promise(resolve => setTimeout(resolve, 6000 + Math.random() * 2000));
                    }
                },
                config: { tension: 35, friction: 130 }
            });

            blob4X.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 40 + 60); // 60-100%
                        await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 2000));
                    }
                },
                config: { tension: 70, friction: 80 }
            });

            blob4Y.start({
                to: async (next) => {
                    while (true) {
                        await next(Math.random() * 40 + 10); // 10-50%
                        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2500));
                    }
                },
                config: { tension: 65, friction: 85 }
            });
        };

        animateBlobs();
    }, [blob1X, blob1Y, blob2X, blob2Y, blob3X, blob3Y, blob4X, blob4Y]);

    return (
        <animated.div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{
                background: gradientPosition.to(
                    pos => `linear-gradient(${pos}deg, #c9d5ef 0%, #f4e1c3 100%)`
                )
            }}
        >
            <animated.div
                className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70"
                style={{
                    width: '35vw',
                    height: '35vw',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    backgroundColor: '#c9d5ef',
                    left: blob1X.to(x => `${x}%`),
                    top: blob1Y.to(y => `${y}%`),
                    transform: blob1X.to(x => `translate(-50%, -50%) scale(${0.8 + Math.sin(x / 10) * 0.2})`)
                }}
            />

            <animated.div
                className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-60"
                style={{
                    width: '40vw',
                    height: '40vw',
                    maxWidth: '450px',
                    maxHeight: '450px',
                    backgroundColor: '#e7b9ac',
                    left: blob2X.to(x => `${x}%`),
                    top: blob2Y.to(y => `${y}%`),
                    transform: blob2Y.to(y => `translate(-50%, -50%) scale(${0.7 + Math.cos(y / 15) * 0.3})`)
                }}
            />

            <animated.div
                className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-40"
                style={{
                    width: '30vw',
                    height: '30vw',
                    maxWidth: '350px',
                    maxHeight: '350px',
                    backgroundColor: '#4a5b91',
                    left: blob3X.to(x => `${x}%`),
                    top: blob3Y.to(y => `${y}%`),
                    transform: blob3X.to(x => `translate(-50%, -50%) scale(${0.9 + Math.sin(x / 20) * 0.1})`)
                }}
            />

            <animated.div
                className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-50"
                style={{
                    width: '25vw',
                    height: '25vw',
                    maxWidth: '300px',
                    maxHeight: '300px',
                    backgroundColor: '#938384',
                    left: blob4X.to(x => `${x}%`),
                    top: blob4Y.to(y => `${y}%`),
                    transform: `translate(-50%, -50%)`
                }}
            />

            <animated.div
                className="absolute inset-0 opacity-30"
                style={{
                    background: gradientPosition.to(
                        pos => `radial-gradient(ellipse at ${50 + Math.sin(pos / 50) * 20}% ${50 + Math.cos(pos / 30) * 20}%, rgba(231, 185, 172, 0.3) 0%, transparent 70%)`
                    )
                }}
            />
        </animated.div>
    );
};

export default LiquidBackground;