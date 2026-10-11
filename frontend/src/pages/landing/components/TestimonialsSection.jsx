export const TestimonialsSection = () => {
  const reviews = [
    {
      quote: "Before IndexPulse, we got chewed up on Bank Nifty breakouts when HDFC Bank was dumping behind the scene. Seeing synthetic constituent order flow in real-time gave our prop desk an instant clarity boost.",
      name: "Rahul K.",
      role: "FT Bank Nifty Scalper, Prop Desk Mumbai",
      initials: "RK",
      avatarColor: "#0284c7"
    },
    {
      quote: "Synthesizing genuine Value Area High & Point of Control directly on Nifty ticks is wizardry. We execute 500+ intraday options lots and this tool paid for its annual fee in literally our first 45 minutes of live trading.",
      name: "Arjun Mehta",
      role: "Lead Quant Trader, Alpha Alpha Capital",
      initials: "AM",
      avatarColor: "#059669"
    },
    {
      quote: "Multi-broker simultaneous routing with sub-second execution delay completely changed our expiry day straddle adjustments. You cannot trade Indian indices at scale without this level of depth.",
      name: "Vikramaditya S.",
      role: "Quantitative Algo Fund Lead, Bengaluru",
      initials: "VS",
      avatarColor: "#7c3aed"
    }
  ];

  return (
    <section 
      style={{ 
        maxWidth: '1240px', 
        margin: '0 auto', 
        padding: '3rem 1.5rem 5rem'
      }}
    >
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', 
          gap: '24px' 
        }}
      >
        {reviews.map((r, idx) => (
          <div 
            key={idx}
            style={{ 
              backgroundColor: '#0c101c', 
              borderRadius: '8px', 
              border: '1px solid #1a2333', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
            }}
          >
            <p 
              style={{ 
                color: '#94a3b8', 
                fontSize: '0.92rem', 
                lineHeight: 1.65, 
                marginBottom: '20px',
                fontStyle: 'italic'
              }}
            >
              &ldquo;{r.quote}&rdquo;
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '6px', 
                  backgroundColor: r.avatarColor, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: '#ffffff'
                }}
              >
                {r.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#f8fafc' }}>
                  {r.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {r.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
