import { forwardRef } from "react";
import "../styles/footer.scss";
import { PIVOTTIME } from "./svgCode";

const socialLinks = [
  {
    href: "https://www.instagram.com/kw_dmd/",
    label: "Instagram",
    icon: (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="10"
          stroke="#E1E1E1"
          strokeWidth="2"
        />
        <circle cx="18" cy="18" r="7" stroke="#E1E1E1" strokeWidth="2" />
        <circle cx="28" cy="9" r="2" fill="#E1E1E1" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@%EA%B3%84%EC%9B%90%EC%98%88%EC%88%A0%EB%8C%80%ED%95%99%EA%B5%90%EB%94%94%EC%A7%80%ED%84%B8",
    label: "YouTube",
    icon: (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="10"
          stroke="#E1E1E1"
          strokeWidth="2"
        />
        <path
          d="M16.0119 23.7524C15.3479 24.2021 14.4512 23.7264 14.4512 22.9244V12.885C14.4512 12.083 15.3479 11.6073 16.0119 12.057L23.4239 17.0767C24.0096 17.4733 24.0096 18.336 23.4239 18.7327L16.0119 23.7524Z"
          fill="#E1E1E1"
        />
      </svg>
    ),
  },
  {
    href: "https://m.blog.naver.com/PostList.naver?blogId=kaywon_dmd&tab=1",
    label: "Kaywon Blog",
    icon: (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="10"
          stroke="#E1E1E1"
          strokeWidth="2"
        />
        <g clipPath="url(#clip0_2767_4714)">
          <path
            d="M17.7141 8.45703H20.94C21.0412 8.45703 21.1228 8.54247 21.1228 8.64847C21.1228 11.3023 19.0655 13.457 16.5315 13.457H13.3056C13.205 13.457 13.1228 13.3716 13.1228 13.2656C13.1228 10.6117 15.1802 8.45703 17.7141 8.45703Z"
            fill="#E1E1E1"
          />
          <path
            d="M24.8411 16.9434C26.4535 16.9436 27.7698 18.2591 27.7698 19.8926C27.7697 21.5257 26.4538 22.8406 24.8411 22.8408H23.2385L22.9768 23.4404C21.8449 26.0331 19.2727 27.8369 16.2864 27.8369C12.2588 27.8368 8.98462 24.554 8.98462 20.4932V16.9434H24.8411ZM23.5842 22.7334H24.7659C26.3524 22.7334 27.6301 21.4405 27.6301 19.8594C27.63 18.2778 26.3518 16.9863 24.7659 16.9863H23.5842V22.7334Z"
            stroke="#E1E1E1"
            strokeWidth="2"
          />
        </g>
        <defs>
          <clipPath id="clip0_2767_4714">
            <rect
              width="20.7847"
              height="20.7847"
              fill="white"
              transform="translate(7.98462 8.05273)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];

export const Footer = forwardRef(function Footer(props, ref) {
  return (
    <footer className="footer" ref={ref}>
      <div className="content">
        <div className="logo">
          <PIVOTTIME />
        </div>

        <div className="center">
          <div className="address">
            <span>
              16038 경기도 의왕시 계원대학교로 66(내손동) 계원예술대학교
            </span>
            <span>
              66 Kaywondaehaengno (Naeson-dong), Uiwang-si, Gyeonggi-do, Korea
            </span>
          </div>

          <p className="copyright">
            ©2025. Delight Insight PIVOTTIME All Right Reserved.
          </p>
        </div>

        <div className="right">
          <div className="social">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="link"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>

          <dl className="contact">
            <dt>Tell</dt>
            <dd>031-424-7509</dd>
            <dt>Fax</dt>
            <dd>1899-5823</dd>
            <dt>E-Mail</dt>
            <dd>
              <a href="mailto:kaywon@kaywon.ac.kr">kaywon@kaywon.ac.kr</a>
            </dd>
          </dl>
        </div>
      </div>
    </footer>
  );
});