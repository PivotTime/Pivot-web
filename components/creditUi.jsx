export function NameList({teamName,listArr, gridName}){


    return(
        <div className="listBox">
            <p className="teamName">{teamName}</p>
            <div className={`nameGrid ${gridName ? gridName : ``}`}>
                {listArr.map((name, i) => (
                    <p
                    key={i}
                    className="name"
                    >
                        {name}
                    </p>

                ))}
            </div>
        </div>
    )
}


export function CreditBox({title, nameList}){
    return(
        <div className="CreditBox">
            <p className="title">{title}</p>
            <div className="middleLine"></div>
            {nameList}
        </div>
    )
}