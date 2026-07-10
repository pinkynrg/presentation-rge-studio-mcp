export default function Roadmap() {
  const cardBase = {
    padding: '1.2rem',
    borderRadius: '12px',
    minHeight: '220px',
  }

  const cardDefault = {
    ...cardBase,
    background: 'linear-gradient(135deg, #f8f6ff 0%, #ffffff 100%)',
    boxShadow: '0 4px 12px rgba(119, 71, 255, 0.15)',
    border: '1px solid #e8deff',
  }

  const cardBeta = {
    ...cardBase,
    background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8f0 100%)',
    boxShadow: '0 8px 24px rgba(255, 68, 68, 0.25)',
    border: '1px solid #ff4444',
    position: 'relative',
  }

  const titleStyle = {
    textAlign: 'center',
    color: '#7747ff',
    margin: 0,
    fontSize: '1.1rem',
  }

  const dateStyle = {
    textAlign: 'center',
    color: '#999',
    fontSize: '0.75rem',
    marginBottom: '1rem',
  }

  const listStyle = {
    margin: 0,
    paddingLeft: '1.2rem',
    fontSize: '0.8rem',
  }

  const itemStyle = {
    margin: '0.3rem 0',
    whiteSpace: 'nowrap',
  }

  const columns = [
    {
      title: 'Public Beta',
      date: 'coming soon',
      items: ['18 tools', 'Any assistant', 'All customers', 'One-click OAuth', 'Inline preview'],
      isBeta: true,
    },
    {
      title: 'Next tools',
      date: 'up next',
      items: [
        'Real images, not placeholders',
        'Reuse saved synced rows',
        'Smart check (before or after)',
        'RGE best-practice review',
        'Exports: .oft, .emltpl, PDF, min. HTML',
        'Marketplace listings',
      ],
    },
    {
      title: 'In-app chat',
      date: 'the big one',
      items: [
        'Agent inside RGE Studio',
        'Navigates the app for you',
        'Knows your workspace context',
        'End-to-end tasks',
      ],
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '2rem',
      marginTop: '2rem',
      fontSize: '0.9rem',
    }}>
      {columns.map((col, idx) => (
        <div key={idx} style={col.isBeta ? cardBeta : cardDefault}>
          {col.isBeta && (
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '12px',
              background: '#ff4444',
              color: 'white',
              padding: '0.3rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(255, 68, 68, 0.4)',
            }}>BETA</div>
          )}
          <h3 style={titleStyle}>{col.title}</h3>
          <div style={dateStyle}>{col.date}</div>
          <ul style={listStyle}>
            {col.items.map((item, i) => (
              <li key={i} style={itemStyle}><strong>{item}</strong></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
