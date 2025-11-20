export default function InfoBox() {
  return (
    <div className="infoBox" style={styles.infoBox}>
      <div className="left" style={styles.left}>
        <div className="title" style={{...styles.nowrap, ...styles.title}}>
          Kaywon University of Arts &amp; Design
          <br />
          32nd Delight Insight
        </div>
        <div className="link" style={{...styles.link, ...styles.nowrap}}>
          Digital-media.kr
          <br />
          degreeshow/2025
        </div>
      </div>
      <div className="location" style={{...styles.location}} >
        Kaywon Design Hall 5F
        <br />
        Nov. 21. FRI - Nov. 23. SUN
      </div>
    </div>
  );
}

const styles = {
  infoBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2.2vw',
    fontSize: 'clamp(0.75rem, 0.73vw, 1.2rem)',
    fontWeight: 500,
    width: "93.85vw",
    color: '#fff',
    letterSpacing: '-0.03rem',
    lineHeight: 1.35,
    pointerEvents: 'none',
    paddingBottom: "4.5vh", 
  },
  title:{
    textAlign:"left",
    fontSize: 'clamp(0.75rem, 0.73vw, 1.2rem)',
    fontWeight: 500,
    color: '#fff',
  },
  link:{
    textAlign:"left",
  },
  left: {
    display: 'flex',
    columnGap: '4.5vw',
    textAlign: 'left',
  },
  location: {
    textAlign: 'right',
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
};