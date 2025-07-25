function Event({ className, title, altDescription, link, img, textDate, textTime, formattedDate }) {
    const image = (
        <div className={`border-[3px] border-[#9886d0] p-[1em] aspect-square w-full flex box-border flex-shrink-0 ${className}`} >
            <img 
            className= "aspect-square object-cover w-full box-border"
                src = {img} 
                alt = {altDescription} 
                title = {title} 
            />  
        </div>
    )

    if (link) {
        return (<a href = {link} >
            {image} 
        </a>)
    }

    return image
}

export default Event;