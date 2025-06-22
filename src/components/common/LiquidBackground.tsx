import Waves from "./Waves/Waves.tsx";

const LiquidBackground = () => {
    return (
        <Waves
            lineColor="#938384"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
            style={{ filter: 'blur(2px)' }}
        />
    );
};

export default LiquidBackground;