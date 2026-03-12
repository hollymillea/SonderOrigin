import styles from "./Merch.module.css";

export function Merch() {
    return (
        <section className={styles.scrollContainer} data-header="accent">
            <div className={styles.container}>
                <div className={styles.title}>merch</div>
                <div className={styles.row}>
                    <div className={styles.imageContainer}>
                        <img src="/images/Merch1.webp" alt="Merchandise" className={styles.merchImage} />
                        <p className={styles.imageTitle}>damn, look at the view !</p>
                        <p className={styles.imageDescription}>LIMITED EDITION CLEAR VINYL</p>
                    </div>
                    <div className={styles.imageContainer}>
                        <img src="/images/Merch2.webp" alt="Merchandise" className={styles.merchImage}/>
                        <p className={styles.imageTitle}>man oh man !</p>
                        <p className={styles.imageDescription}>COLOURED VINYL</p>
                    </div>
                </div>
                <button className={styles.button}>shop all here</button>
                <div className={styles.texture}></div>
            </div>
            <div className={styles.overlayContainer}>
                <div className={styles.overlayLeft}>
                    <p>damn, look at the view !</p>
                    <p>grateful</p>
                    <p>elsie</p>
                    <p>walking on air</p>
                    <p>love is a black hole !</p>
                    <p>alright ?</p>
                    <p>**it gets better</p>
                    <p>see u later x</p>
                </div>
                <div className={styles.overlayRight}>
                    <p>hello !</p>
                    <p>back 2 ya</p>
                    <p>this is me now</p>
                    <p>care - interlude</p>
                    <p>animal</p>
                    <p>chew u UP</p>
                    <p>say less !</p>
                    <p>losing me - interlude</p>
                    <p>this love's gonna go nowhere</p>
                    <p>to be a man</p>
                    <p>good god you've gotta try !</p>
                </div>
            </div>
        </section>
    );
}