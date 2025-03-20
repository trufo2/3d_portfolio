const Home = () => {
    return (
        <div className="hero-section-a">
            <div className={`hero-section-b disable-select relative z-30 bg-black/10 max-w-full mx-auto ${window.matchMedia('(pointer: coarse)').matches ? 'mt-5' : 'mt-9'}`}
                style={{ 
                    height: 'auto',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.1)',
                    width: '100%'
                }}>
                <p className={`hero-section-c ${window.matchMedia('(pointer: coarse)').matches ? 'mt-1' : 'mt-7'}`}>
                    Hello, je suis Michael<span className="waving-hand">👋</span>
                </p>
                <p className="hero_tag hero-section-d">Bienvenue sur mon portfolio!</p>
            </div>
        </div>
    );
}

export default Home;
