import "../styles/students.scss";

export function RectSvg({left, top}){
  return(
    <div style={{transform: `translate(${left}%, ${top}%)` }}>
      <svg className="RectSvg" width="335" height="335" viewBox="0 0 335 335" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.4">
          <rect x="86.5694" y="75.5305" width="105.816" height="123.087" transform="rotate(-45 86.5694 75.5305)" stroke="white"/>
          <rect x="248.431" y="259.471" width="105.816" height="123.087" transform="rotate(135 248.431 259.471)" stroke="white"/>
          <rect x="259.471" y="86.5714" width="105.816" height="123.087" transform="rotate(45 259.471 86.5714)" stroke="white"/>
          <rect x="75.5303" y="248.433" width="105.816" height="123.087" transform="rotate(-135 75.5303 248.433)" stroke="white"/>
          <rect x="143.398" y="47.3863" width="105.816" height="123.087" transform="rotate(-15 143.398 47.3863)" stroke="white"/>
          <rect x="191.602" y="287.616" width="105.816" height="123.087" transform="rotate(165 191.602 287.616)" stroke="white"/>
          <rect x="287.615" y="143.398" width="105.816" height="123.087" transform="rotate(75 287.615 143.398)" stroke="white"/>
          <rect x="47.3863" y="191.604" width="105.816" height="123.087" transform="rotate(-105 47.3863 191.604)" stroke="white"/>
          <rect x="206.685" y="51.4276" width="105.816" height="123.087" transform="rotate(15 206.685 51.4276)" stroke="white"/>
          <rect x="128.315" y="283.575" width="105.816" height="123.087" transform="rotate(-165 128.315 283.575)" stroke="white"/>
          <rect x="283.575" y="206.686" width="105.816" height="123.087" transform="rotate(105 283.575 206.686)" stroke="white"/>
          <rect x="51.4268" y="128.316" width="105.816" height="123.087" transform="rotate(-75 51.4268 128.316)" stroke="white"/>
        </g>
      </svg>
    </div>
  )
}


 export function LineSvg({left, top}){
  return(
    <div style={{transform: `translate(${left}%, ${top}%)` }}>
      <svg className="LineSvg" width="351" height="351" viewBox="0 0 351 269" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.7">
          <line x1="149.342" y1="26.1592" x2="202.644" y2="328.45" stroke="#C8C8C8"/>
          <line x1="202.645" y1="26.3348" x2="149.343" y2="328.625" stroke="#C8C8C8"/>
          <line x1="252.673" y1="44.7302" x2="99.1958" y2="310.56" stroke="#C8C8C8"/>
          <line x1="293.394" y1="79.1283" x2="58.2539" y2="276.434" stroke="#C8C8C8"/>
          <line x1="319.893" y1="125.373" x2="31.451" y2="230.358" stroke="#C8C8C8"/>
          <line x1="328.977" y1="177.894" x2="22.0233" y2="177.894" stroke="#C8C8C8"/>
          <line x1="319.551" y1="230.356" x2="31.109" y2="125.372" stroke="#C8C8C8"/>
          <line x1="292.748" y1="276.43" x2="57.6083" y2="79.1238" stroke="#C8C8C8"/>
          <line x1="251.807" y1="310.559" x2="98.3298" y2="44.7293" stroke="#C8C8C8"/>
          <circle cx="175.501" cy="177.391" r="85.229" transform="rotate(-180 175.501 177.391)" fill="black"/>
          <line x1="176.001" y1="57.6677" x2="176.001" y2="297.108" stroke="#C8C8C8"/>
          <line x1="216.918" y1="65.0569" x2="135.024" y2="290.057" stroke="#C8C8C8"/>
          <line x1="252.838" y1="86.0018" x2="98.9295" y2="269.423" stroke="#C8C8C8"/>
          <line x1="279.432" y1="117.963" x2="72.0704" y2="237.683" stroke="#C8C8C8"/>
          <line x1="293.489" y1="157.095" x2="57.6868" y2="198.673" stroke="#C8C8C8"/>
          <line x1="293.315" y1="198.672" x2="57.5131" y2="157.094" stroke="#C8C8C8"/>
          <line x1="278.932" y1="237.682" x2="71.5705" y2="117.962" stroke="#C8C8C8"/>
          <line x1="252.072" y1="269.422" x2="98.1629" y2="86.0005" stroke="#C8C8C8"/>
          <line x1="215.98" y1="290.057" x2="134.087" y2="65.0574" stroke="#C8C8C8"/>
          <line x1="176.002" y1="57.6664" x2="176.002" y2="297.106" stroke="#C8C8C8"/>
          <line x1="216.918" y1="65.0557" x2="135.025" y2="290.056" stroke="#C8C8C8"/>
          <line x1="252.838" y1="86.0003" x2="98.9295" y2="269.422" stroke="#C8C8C8"/>
          <line x1="279.432" y1="117.962" x2="72.0709" y2="237.681" stroke="#C8C8C8"/>
          <line x1="293.49" y1="157.093" x2="57.6878" y2="198.672" stroke="#C8C8C8"/>
          <line x1="293.316" y1="198.67" x2="57.5141" y2="157.091" stroke="#C8C8C8"/>
          <line x1="278.932" y1="237.681" x2="71.571" y2="117.961" stroke="#C8C8C8"/>
          <line x1="252.072" y1="269.421" x2="98.1634" y2="85.9993" stroke="#C8C8C8"/>
          <line x1="215.98" y1="290.056" x2="134.087" y2="65.056" stroke="#C8C8C8"/>
        </g>
      </svg>
    </div>
  )
}


export function CircleSvg({left, top}){
    return(
      <div style={{transform: `translate(${left}%, ${top}%)` }}>
        <svg className="CircleSvg" width="545" height="459" viewBox="0 0 545 459" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.5">
            <circle cx="185.621" cy="179.326" r="124.979" transform="rotate(30 185.621 179.326)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="209.995" cy="193.398" r="124.979" transform="rotate(30 209.995 193.398)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="260.031" cy="222.287" r="124.979" transform="rotate(30 260.031 222.287)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="297.236" cy="243.766" r="124.979" transform="rotate(30 297.236 243.766)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="334.44" cy="265.246" r="124.979" transform="rotate(30 334.44 265.246)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="358.814" cy="279.32" r="124.979" transform="rotate(30 358.814 279.32)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="170.726" cy="170.725" r="124.979" transform="rotate(30 170.726 170.725)" stroke="#D9D9D9" strokeWidth="1.20117"/>
            <circle cx="373.71" cy="287.919" r="124.979" transform="rotate(30 373.71 287.919)" stroke="#D9D9D9" strokeWidth="1.20117"/>
          </g>
        </svg>
      </div>
    )
}
