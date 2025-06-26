export default function LIfeBar(props){
    const bars = Array.from({length:props.left}).map((item, index) => (
        <span key={index} className={`lifebar ${props.left <= 4 ? "red":""}`}></span>
    ))
    return(
        <>
            <p className="lifebar">Lives remaining: {props.left}</p>
            <section className="life">
                {bars}
            </section>
        </>
        
    )
}