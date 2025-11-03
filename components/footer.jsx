import Image from "next/image"

export function Footer(){
    return(
        <div className="footerPlaceHolder">
        <Image
        alt="푸터 임시 이미지"
        src={"/images/footer.png"}
        width={1920}
        height={1080}
        style={{objectFit:"cover"}}
        />
        </div>

    )
}