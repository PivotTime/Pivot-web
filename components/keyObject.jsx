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
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${left}%, ${top}%)`
      }}>
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


export function DeveloperPivot(){
  return(
<svg className="DeveloperPivot" width="1154" height="933" viewBox="0 0 1154 933" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.5" d="M997.775 653.253L1139.48 318.285L951.422 358.631L882.257 550.576L997.775 653.253Z" stroke="url(#paint0_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M992.285 650.246L1123.39 301.181L937.205 360.274L872.456 556.418L992.285 650.246Z" stroke="url(#paint1_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M984.857 648.187L1105.97 284.823L922.056 362.586L861.023 561.433L984.857 648.187Z" stroke="url(#paint2_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M976.489 645.496L1085.02 270.464L907.532 366.002L851.452 568.453L976.489 645.496Z" stroke="url(#paint3_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M966.43 640.85L1064.23 256.893L893.085 369.812L839.712 575.245L966.43 640.85Z" stroke="url(#paint4_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M955.432 635.571L1042.46 244.167L876.97 374.275L825.979 581.856L955.432 635.571Z" stroke="url(#paint5_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M941.707 631.397L1018.72 233.869L861.323 379.055L813.136 589.273L941.707 631.397Z" stroke="url(#paint6_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M925.678 625.469L993.475 224.273L846.492 384.246L799.112 596.92L925.678 625.469Z" stroke="url(#paint7_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M907.925 619.065L967.183 218.479L830.072 390.487L784.555 605.164L907.925 619.065Z" stroke="url(#paint8_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M885.405 608.362L940.291 212.145L813.993 396.82L768.641 613.589L885.405 608.362Z" stroke="url(#paint9_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M858.539 604.64L918.601 209.857L796.377 407.378L752.308 621.526L858.539 604.64Z" stroke="url(#paint10_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M830.561 603.586L885.447 207.37L780.06 411.228L733.578 631.404L830.561 603.586Z" stroke="url(#paint11_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M803.597 572.681L856.49 207.159L762.998 420.451L714.789 640.148L803.597 572.681Z" stroke="url(#paint12_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M768.392 558.094L828.722 208.024L745.376 427.66L693.571 650.267L768.392 558.094Z" stroke="url(#paint13_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M730.337 541.042L801.227 211.939L729.271 433.428L671.627 661.672L730.337 541.042Z" stroke="url(#paint14_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M692.686 458.074L747.793 223.548L645.752 503.289L624.501 680.05L692.686 458.074Z" stroke="url(#paint15_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M675.316 462.377L722.203 231.34L601.396 486.168L598.596 688.312L675.316 462.377Z" stroke="url(#paint16_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M656.293 482.03L698.047 237.296L556.409 464.592L570.423 700.037L656.293 482.03Z" stroke="url(#paint17_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M639.022 483.943L673.825 247.513L512.85 443.227L541.883 709.058L639.022 483.943Z" stroke="url(#paint18_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M621 493.271L650.257 256.049L468.661 422.802L512.72 716.974L621 493.271Z" stroke="url(#paint19_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M603.312 501.393L629.481 265.919L429.095 401.8L482.069 723.551L603.312 501.393Z" stroke="url(#paint20_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M586.007 508.132L610.047 274.3L391.988 383.338L450.238 730.358L586.007 508.132Z" stroke="url(#paint21_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M566.365 517.942L590.405 284.11L357.522 365.42L418.751 733.911L566.365 517.942Z" stroke="url(#paint22_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M549.38 527.558L572.566 294.792L327.92 349.408L386.036 737.868L549.38 527.558Z" stroke="url(#paint23_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M532.115 536.168L556.473 305.214L302.963 335.428L353.99 739.408L532.115 536.168Z" stroke="url(#paint24_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M514.26 545.549L540.317 314.508L282.492 322.695L321.054 738.101L514.26 545.549Z" stroke="url(#paint25_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M498.011 551.837L526.525 323.337L265.856 311.578L291.951 735.063L498.011 551.837Z" stroke="url(#paint26_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M480.784 558.967L512.102 333.103L251.572 302.04L257.205 731.574L480.784 558.967Z" stroke="url(#paint27_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M464.583 565.081L500.576 341.814L241.934 294.534L227.372 726.472L464.583 565.081Z" stroke="url(#paint28_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M447.721 571.569L488.013 350.237L234.053 288.072L198.823 718.749L447.721 571.569Z" stroke="url(#paint29_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M431.843 575.169L476.754 358.65L230.489 282.807L172.476 706.429L431.843 575.169Z" stroke="url(#paint30_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M416.151 580.122L466.274 365.605L228.731 278.415L146.555 697.948L416.151 580.122Z" stroke="url(#paint31_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M401.356 583.837L457.046 372.722L227.028 275.155L122.718 682.604L401.356 583.837Z" stroke="url(#paint32_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M385.451 586.871L447.715 378.878L227.621 272.343L101.773 668.246L385.451 586.871Z" stroke="url(#paint33_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M356.383 591.093L439.517 384.977L229.233 270.556L81.6703 651.517L356.383 591.093Z" stroke="url(#paint34_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M340.966 593.704L431.932 390.873L230.623 268.895L65.4793 631.408L340.966 593.704Z" stroke="url(#paint35_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M327.668 593.369L423.8 396.061L232.657 267.599L49.1556 613.123L327.668 593.369Z" stroke="url(#paint36_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M313.082 592.304L415.857 400.556L234.891 266.915L37.0688 592.291L313.082 592.304Z" stroke="url(#paint37_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M300.33 589.33L408.37 406.108L237.521 266.157L25.743 570.741L300.33 589.33Z" stroke="url(#paint38_linear_1876_3929)" strokeWidth="1.5"/>
<path opacity="0.5" d="M774.48 217.178L694.332 506.518L648.242 671.562L708.878 454.005L774.48 217.178Z" stroke="url(#paint39_linear_1876_3929)" strokeWidth="1.5"/>
<defs>
<linearGradient id="paint0_linear_1876_3929" x1="1049.91" y1="293.474" x2="953.639" y2="641.028" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint1_linear_1876_3929" x1="1039.69" y1="277.997" x2="940.549" y2="635.915" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint2_linear_1876_3929" x1="1027.81" y1="263.171" x2="925.694" y2="631.798" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint3_linear_1876_3929" x1="1014.89" y1="251.037" x2="910.675" y2="627.265" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint4_linear_1876_3929" x1="1003.25" y1="240.002" x2="897.506" y2="621.758" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint5_linear_1876_3929" x1="992.282" y1="230.266" x2="885.386" y2="616.168" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint6_linear_1876_3929" x1="979.678" y1="223.055" x2="871.92" y2="612.066" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint7_linear_1876_3929" x1="965.923" y1="216.641" x2="856.203" y2="612.734" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint8_linear_1876_3929" x1="949.649" y1="213.622" x2="837.154" y2="619.734" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint9_linear_1876_3929" x1="930.877" y1="209.538" x2="815.367" y2="626.532" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint10_linear_1876_3929" x1="910.143" y1="207.514" x2="792.384" y2="632.628" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint11_linear_1876_3929" x1="888.211" y1="208.135" x2="768.299" y2="641.022" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint12_linear_1876_3929" x1="862.968" y1="208.953" x2="741.477" y2="647.541" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint13_linear_1876_3929" x1="835.286" y1="209.842" x2="711.881" y2="655.339" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint14_linear_1876_3929" x1="805.718" y1="213.183" x2="680.782" y2="664.208" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint15_linear_1876_3929" x1="740.97" y1="221.658" x2="614.741" y2="677.346" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint16_linear_1876_3929" x1="706.829" y1="227.081" x2="580.458" y2="683.288" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint17_linear_1876_3929" x1="673.604" y1="230.525" x2="545.462" y2="693.123" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint18_linear_1876_3929" x1="638.5" y1="237.728" x2="510.358" y2="700.326" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint19_linear_1876_3929" x1="604.308" y1="243.321" x2="475.927" y2="706.782" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint20_linear_1876_3929" x1="572.045" y1="250.009" x2="443.807" y2="712.952" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint21_linear_1876_3929" x1="541.728" y1="255.375" x2="413.012" y2="720.046" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint22_linear_1876_3929" x1="511.635" y1="262.291" x2="383.685" y2="724.198" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint23_linear_1876_3929" x1="485.16" y1="270.58" x2="357.879" y2="730.069" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint24_linear_1876_3929" x1="461.034" y1="278.777" x2="334.902" y2="734.12" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint25_linear_1876_3929" x1="439.264" y1="286.515" x2="314.663" y2="736.331" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint26_linear_1876_3929" x1="420.118" y1="293.861" x2="297.478" y2="736.594" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint27_linear_1876_3929" x1="401.635" y1="302.503" x2="280.957" y2="738.154" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint28_linear_1876_3929" x1="386.395" y1="310.185" x2="267.966" y2="737.717" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint29_linear_1876_3929" x1="371.846" y1="318.058" x2="256.432" y2="734.707" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint30_linear_1876_3929" x1="361.598" y1="319.125" x2="248.481" y2="727.483" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint31_linear_1876_3929" x1="354.572" y1="313.274" x2="240.785" y2="724.05" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint32_linear_1876_3929" x1="347.687" y1="308.578" x2="235.431" y2="713.826" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint33_linear_1876_3929" x1="336.016" y1="302.368" x2="225.195" y2="702.435" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint34_linear_1876_3929" x1="322.081" y1="296.276" x2="213.557" y2="688.05" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint35_linear_1876_3929" x1="309.738" y1="290.81" x2="204.708" y2="669.975" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint36_linear_1876_3929" x1="297.176" y1="285.471" x2="195.207" y2="653.58" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint37_linear_1876_3929" x1="286.108" y1="281.103" x2="188.303" y2="634.184" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint38_linear_1876_3929" x1="275.696" y1="276.731" x2="182.246" y2="614.093" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
<linearGradient id="paint39_linear_1876_3929" x1="774.307" y1="217.13" x2="648.414" y2="671.61" gradientUnits="userSpaceOnUse">
<stop stop-color="#A4A4A4" stop-opacity="0.6"/>
<stop offset="0.471154" stop-color="#E1E1E1"/>
<stop offset="1" stop-color="#A4A4A4" stop-opacity="0.6"/>
</linearGradient>
</defs>
</svg>



  )
}

export function DesignerPivot(){
  return(
   <svg className="DesignerPivot" viewBox="0 0 1200 743" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="541.886" cy="371.083" rx="57.9155" ry="370.333" stroke="url(#paint0_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="57.9155" cy="370.333" rx="57.9155" ry="370.333" transform="matrix(-1 0 0 1 715.631 0.75)" stroke="url(#paint1_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="443.712" cy="371.083" rx="156.088" ry="370.333" stroke="url(#paint2_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="156.088" cy="370.333" rx="156.088" ry="370.333" transform="matrix(-1 0 0 1 911.977 0.75)" stroke="url(#paint3_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="370.601" cy="371.083" rx="229.2" ry="370.333" stroke="url(#paint4_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="229.2" cy="370.333" rx="229.2" ry="370.333" transform="matrix(-1 0 0 1 1058.2 0.75)" stroke="url(#paint5_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="320.208" cy="371.083" rx="279.594" ry="349.886" stroke="url(#paint6_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="279.594" cy="349.886" rx="279.594" ry="349.886" transform="matrix(-1 0 0 1 1158.99 21.1963)" stroke="url(#paint7_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="300.276" cy="371.084" rx="299.526" ry="340.138" stroke="url(#paint8_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="299.526" cy="340.138" rx="299.526" ry="340.138" transform="matrix(-1 0 0 1 1198.85 30.9463)" stroke="url(#paint9_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="310.134" cy="357.658" rx="289.667" ry="314.818" stroke="url(#paint10_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="289.667" cy="314.818" rx="289.667" ry="314.818" transform="matrix(-1 0 0 1 1179.13 42.8408)" stroke="url(#paint11_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="304.191" cy="343.374" rx="295.61" ry="292.204" stroke="url(#paint12_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="295.61" cy="292.204" rx="295.61" ry="292.204" transform="matrix(-1 0 0 1 1191.02 51.1709)" stroke="url(#paint13_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="304.191" cy="331.914" rx="295.61" ry="274.264" stroke="url(#paint14_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="295.61" cy="274.264" rx="295.61" ry="274.264" transform="matrix(-1 0 0 1 1191.02 57.6494)" stroke="url(#paint15_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="314.041" cy="316.409" rx="285.76" ry="258.76" stroke="url(#paint16_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="285.76" cy="258.76" rx="285.76" ry="258.76" transform="matrix(-1 0 0 1 1171.32 57.6494)" stroke="url(#paint17_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="335.565" cy="302.06" rx="264.236" ry="244.41" stroke="url(#paint18_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="264.236" cy="244.41" rx="264.236" ry="244.41" transform="matrix(-1 0 0 1 1128.27 57.6494)" stroke="url(#paint19_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="358.524" cy="290.102" rx="241.276" ry="232.452" stroke="url(#paint20_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="241.276" cy="232.452" rx="241.276" ry="232.452" transform="matrix(-1 0 0 1 1082.35 57.6494)" stroke="url(#paint21_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="386.746" cy="280.057" rx="213.055" ry="222.408" stroke="url(#paint22_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse cx="213.055" cy="222.408" rx="213.055" ry="222.408" transform="matrix(-1 0 0 1 1025.91 57.6494)" stroke="url(#paint23_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.74" cx="414.009" cy="277.187" rx="185.791" ry="219.538" stroke="url(#paint24_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.74" cx="185.791" cy="219.538" rx="185.791" ry="219.538" transform="matrix(-1 0 0 1 971.382 57.6494)" stroke="url(#paint25_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.7" cx="443.712" cy="268.578" rx="156.088" ry="210.929" stroke="url(#paint26_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.7" cx="156.088" cy="210.929" rx="156.088" ry="210.929" transform="matrix(-1 0 0 1 911.977 57.6494)" stroke="url(#paint27_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="472.844" cy="263.316" rx="126.957" ry="205.667" stroke="url(#paint28_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="126.957" cy="205.667" rx="126.957" ry="205.667" transform="matrix(-1 0 0 1 853.715 57.6494)" stroke="url(#paint29_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="501.064" cy="260.446" rx="98.7363" ry="202.797" stroke="url(#paint30_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="98.7363" cy="202.797" rx="98.7363" ry="202.797" transform="matrix(-1 0 0 1 797.273 57.6494)" stroke="url(#paint31_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="530.721" cy="255.664" rx="69.0803" ry="198.014" stroke="url(#paint32_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="69.0803" cy="198.014" rx="69.0803" ry="198.014" transform="matrix(-1 0 0 1 737.961 57.6494)" stroke="url(#paint33_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.12" cx="557.985" cy="252.315" rx="41.8155" ry="194.665" stroke="url(#paint34_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.34" cx="41.8155" cy="194.665" rx="41.8155" ry="194.665" transform="matrix(-1 0 0 1 683.432 57.6494)" stroke="url(#paint35_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.12" cx="585.838" cy="252.315" rx="13.9632" ry="194.665" stroke="url(#paint36_linear_1802_4325)" strokeWidth="1.5"/>
<ellipse opacity="0.12" cx="13.9632" cy="194.665" rx="13.9632" ry="194.665" transform="matrix(-1 0 0 1 627.727 57.6494)" stroke="url(#paint37_linear_1802_4325)" strokeWidth="1.5"/>
<defs>
<linearGradient id="paint0_linear_1802_4325" x1="541.886" y1="0.75" x2="541.886" y2="741.417" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint1_linear_1802_4325" x1="57.9155" y1="0" x2="57.9155" y2="740.667" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint2_linear_1802_4325" x1="443.712" y1="0.75" x2="443.712" y2="741.417" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint3_linear_1802_4325" x1="156.088" y1="0" x2="156.088" y2="740.667" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint4_linear_1802_4325" x1="370.601" y1="0.75" x2="370.601" y2="741.417" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint5_linear_1802_4325" x1="229.2" y1="0" x2="229.2" y2="740.667" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint6_linear_1802_4325" x1="320.208" y1="21.1963" x2="320.208" y2="720.969" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint7_linear_1802_4325" x1="279.594" y1="0" x2="279.594" y2="699.773" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint8_linear_1802_4325" x1="300.276" y1="30.9463" x2="300.276" y2="711.222" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint9_linear_1802_4325" x1="299.526" y1="0" x2="299.526" y2="680.275" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint10_linear_1802_4325" x1="310.134" y1="42.8408" x2="310.134" y2="672.476" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint11_linear_1802_4325" x1="289.667" y1="0" x2="289.667" y2="629.635" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint12_linear_1802_4325" x1="304.191" y1="51.1709" x2="304.191" y2="635.578" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint13_linear_1802_4325" x1="295.61" y1="0" x2="295.61" y2="584.407" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint14_linear_1802_4325" x1="304.191" y1="57.6494" x2="304.191" y2="606.178" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint15_linear_1802_4325" x1="295.61" y1="0" x2="295.61" y2="548.528" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint16_linear_1802_4325" x1="314.041" y1="57.6494" x2="314.041" y2="575.169" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint17_linear_1802_4325" x1="285.76" y1="0" x2="285.76" y2="517.52" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint18_linear_1802_4325" x1="335.565" y1="57.6494" x2="335.565" y2="546.47" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint19_linear_1802_4325" x1="264.236" y1="0" x2="264.236" y2="488.821" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint20_linear_1802_4325" x1="358.524" y1="57.6494" x2="358.524" y2="522.554" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint21_linear_1802_4325" x1="241.276" y1="0" x2="241.276" y2="464.905" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint22_linear_1802_4325" x1="386.746" y1="57.6494" x2="386.746" y2="502.465" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint23_linear_1802_4325" x1="213.055" y1="0" x2="213.055" y2="444.816" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint24_linear_1802_4325" x1="414.009" y1="57.6494" x2="414.009" y2="496.725" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint25_linear_1802_4325" x1="185.791" y1="0" x2="185.791" y2="439.076" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint26_linear_1802_4325" x1="443.712" y1="57.6494" x2="443.712" y2="479.507" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint27_linear_1802_4325" x1="156.088" y1="0" x2="156.088" y2="421.857" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint28_linear_1802_4325" x1="472.844" y1="57.6494" x2="472.844" y2="468.984" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint29_linear_1802_4325" x1="126.957" y1="0" x2="126.957" y2="411.334" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint30_linear_1802_4325" x1="501.064" y1="57.6494" x2="501.064" y2="463.243" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint31_linear_1802_4325" x1="98.7363" y1="0" x2="98.7363" y2="405.594" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint32_linear_1802_4325" x1="530.721" y1="57.6494" x2="530.721" y2="453.678" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint33_linear_1802_4325" x1="69.0803" y1="0" x2="69.0803" y2="396.028" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint34_linear_1802_4325" x1="557.985" y1="57.6494" x2="557.985" y2="446.98" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint35_linear_1802_4325" x1="41.8155" y1="0" x2="41.8155" y2="389.33" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint36_linear_1802_4325" x1="585.838" y1="57.6494" x2="585.838" y2="446.98" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
<linearGradient id="paint37_linear_1802_4325" x1="13.9632" y1="0" x2="13.9632" y2="389.33" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="0.504808" stopColor="#999999"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
</defs>
</svg>


  )
}

export function PlannerPivot(
){
  return(
    <svg className="PlannerPivot" viewBox="0 0 1324 1234" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1323.42 644.979L179.802 685.782" stroke="url(#paint0_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M460.865 1201.43L875.687 134.1" stroke="url(#paint1_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M644.673 12.248L685.444 1156.78" stroke="url(#paint2_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M1201.36 875.992L134.886 460.776" stroke="url(#paint3_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M977.087 51.0078L413.474 1176.91" stroke="url(#paint4_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M1276.77 599.903L116.821 730.424" stroke="url(#paint5_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M0.13862 793.951L1122.79 582.876" stroke="url(#paint6_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M1110.16 1147.62L267.715 232.177" stroke="url(#paint7_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M1073.85 1012.67L256.27 318.086" stroke="url(#paint8_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M911.819 1092.39L324.882 71.3779" stroke="url(#paint9_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M774.285 1075.18L545.994 201.094" stroke="url(#paint10_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M795.382 1075.55L485.612 84.875" stroke="url(#paint11_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M1027.45 275.704L240.184 1135.79" stroke="url(#paint12_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M1099.77 513.652L144.847 856.301" stroke="url(#paint13_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M1027.57 459.783L179.863 951.281" stroke="url(#paint14_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M1190.16 705.161L230.533 637.548" stroke="url(#paint15_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M1255.62 848.066L51.4887 479.783" stroke="url(#paint16_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M862.324 771.66L117.007 375.391" stroke="url(#paint17_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M1155.51 744.975L116.697 581.762" stroke="url(#paint18_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M728.009 1233.69L604.584 70.5732" stroke="url(#paint19_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M690.207 144.997L645.415 1191.58" stroke="url(#paint20_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M828.605 176.512L523.474 1111.27" stroke="url(#paint21_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M991.936 505.975L254.784 876.61" stroke="url(#paint22_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M928.213 305.672L350.556 1111.03" stroke="url(#paint23_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M607.057 1099.94L716.562 324.929" stroke="url(#paint24_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M878.162 987.069L435.623 314.588" stroke="url(#paint25_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M634.341 1053.26L706.54 229.266" stroke="url(#paint26_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M863.624 1160.5L528.24 316.693" stroke="url(#paint27_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M594.003 258.491L762.84 1193.19" stroke="url(#paint28_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M227.935 365.607L939.473 855.124" stroke="url(#paint29_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M918.499 1188.43L422.868 156.874" stroke="url(#paint30_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M1162.12 1038.23L225.549 341.545" stroke="url(#paint31_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M556.028 1146.88L824.388 0.170784" stroke="url(#paint32_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.7" d="M1091.7 854.351L160.073 452.643" stroke="url(#paint33_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M974.469 1061.42L326.969 232.851" stroke="url(#paint34_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.5" d="M1044.12 302.882L296.765 1036.92" stroke="url(#paint35_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path opacity="0.3" d="M1018.15 775.108L226.524 542.548" stroke="url(#paint36_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M603.718 1047.57L739.59 254.089" stroke="url(#paint37_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<path d="M554.181 151.695L739.769 995.182" stroke="url(#paint38_radial_1305_3895)" strokeWidth="1.5" strokeMiterlimit="10"/>
<defs>
<radialGradient id="paint0_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(751.612 665.38) rotate(90) scale(20.4017 571.81)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint1_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(668.276 667.763) rotate(90) scale(533.663 207.411)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint2_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(665.058 584.516) rotate(90) scale(572.268 20.3853)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint3_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(668.122 668.384) rotate(90) scale(207.608 533.236)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint4_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(695.281 613.958) rotate(90) scale(562.95 281.806)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint5_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(696.798 665.164) rotate(90) scale(65.2606 579.977)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint6_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(561.462 688.414) rotate(90) scale(105.538 561.324)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint7_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(688.94 689.899) rotate(90) scale(457.722 421.225)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint8_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(665.06 665.379) rotate(90) scale(347.293 408.789)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint9_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(618.351 581.884) rotate(90) scale(510.506 293.468)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint10_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(660.14 638.135) rotate(90) scale(437.042 114.146)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint11_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(640.497 580.211) rotate(90) scale(495.336 154.885)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint12_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(633.816 705.749) rotate(90) scale(430.045 393.632)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint13_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(622.31 684.977) rotate(90) scale(171.325 477.462)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint14_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(603.718 705.532) rotate(90) scale(245.749 423.854)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint15_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(710.346 671.355) rotate(90) scale(33.8067 479.813)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint16_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(653.552 663.925) rotate(90) scale(184.141 602.063)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint17_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(489.665 573.525) rotate(90) scale(198.135 372.659)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint18_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(636.106 663.368) rotate(90) scale(81.6067 519.409)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint19_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(666.296 652.129) rotate(90) scale(581.556 61.7128)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint20_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(667.811 668.289) rotate(90) scale(523.292 22.396)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint21_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(676.04 643.893) rotate(90) scale(467.381 152.565)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint22_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(623.36 691.292) rotate(90) scale(185.318 368.576)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint23_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(639.385 708.349) rotate(90) scale(402.678 288.828)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint24_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(661.81 712.437) rotate(90) scale(387.508 54.7527)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint25_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(656.893 650.828) rotate(90) scale(336.241 221.269)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint26_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(670.44 641.262) rotate(90) scale(411.996 36.0997)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint27_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(695.932 738.596) rotate(90) scale(421.903 167.692)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint28_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(678.422 725.841) rotate(90) scale(467.35 84.4182)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint29_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(583.704 610.366) rotate(90) scale(244.758 355.769)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint30_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(670.683 672.654) rotate(133.064) scale(207.608 533.236)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint31_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(693.833 689.887) rotate(133.064) scale(65.2606 579.977)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint32_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(690.208 573.526) rotate(133.064) scale(510.506 293.468)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint33_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(625.884 653.497) rotate(133.064) scale(171.325 477.462)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint34_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(650.719 647.135) rotate(133.064) scale(81.6067 519.409)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint35_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(670.441 669.899) rotate(133.064) scale(523.292 22.396)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint36_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(622.339 658.828) rotate(133.064) scale(185.318 368.576)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint37_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(671.654 650.828) rotate(133.064) scale(336.241 221.269)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
<radialGradient id="paint38_radial_1305_3895" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(646.975 573.438) rotate(133.064) scale(244.758 355.769)">
<stop stopColor="#999999"/>
<stop offset="0.5" stopColor="white"/>
<stop offset="1" stopColor="#999999"/>
</radialGradient>
</defs>
</svg>

  )
}