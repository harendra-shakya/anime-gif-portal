import styles from "../styles/Home.module.css";
import "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [gifList, setGifList] = useState<string[]>([]);

    const TEST_GIFS: string[] = [
        "https://media1.giphy.com/media/Mj0gk1wnekXC0/giphy.gif?cid=ecf05e47kpq1i1fwwfx3y3ojtmmr3qsgl99cxbcwpwv2cy21&rid=giphy.gif&ct=g",
        "https://media4.giphy.com/media/uBf0gYEaqtr0s/giphy.gif?cid=ecf05e4772hwca05wnool8c93zomofldrvoyrdaicojz7r0h&rid=giphy.gif&ct=g",
        "https://media2.giphy.com/media/efBMK8mUALiLe/200w.webp?cid=ecf05e47ltu6136u2rpfjcwtqqzhnwk28nr9k0ot7jzr0tpg&rid=200w.webp&ct=g",
        "https://media2.giphy.com/media/3fNmJ20ErpkjK/200w.webp?cid=ecf05e476cd31ptp4d3zt4tesdxznhh2iz5hwm6f37ug5nsf&rid=200w.webp&ct=g",
    ];

    const sendGif = async () => {
        if (inputValue.length > 0) {
            console.log("Gif link:", inputValue);
            setGifList([...gifList, inputValue]);
            setInputValue("");
        } else {
            console.log("Empty input. Try again.");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        if (walletAddress) {
            console.log("Fetching GIF list...");
            setGifList(TEST_GIFS);
        }
    }, [walletAddress]);

    const checkIfWalletIsConnected = async () => {
        try {
            const { solana }: any = window;

            if (solana) {
                if (solana.isPhantom) {
                    const response = await solana.connect({ onlyIfTrusted: true });
                    setWalletAddress(response.publicKey.toString());
                    console.log("Phantom wallet found!");
                }
            } else {
                alert("Solana object not found! Get a Phantom Wallet 👻");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const connectWallet = async () => {
        const { solana }: any = window;

        if (solana) {
            const response = await solana.connect();
            console.log("Connected with Public Key:", response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
        }
    };
    const renderNotConnectedContainer = () => (
        <button className={`${styles.ctaButton} ${styles.connectButton}`} onClick={connectWallet}>
            Connect to Wallet
        </button>
    );

    const renderConnectedContainer = () => (
        <div className={styles.connectedContainer}>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    sendGif();
                }}
            >
                <input
                    type="text"
                    placeholder="Enter GIF link!"
                    onChange={(e) => {
                        setInputValue(e.target.value);
                    }}
                />
                <button type="submit" className={`${styles.ctaButton} ${styles.submiGifBtn}`}>
                    Submit
                </button>
            </form>
            <div className={styles.giGrid}>
                {gifList.map((gif) => (
                    <div className={styles.gifItem} key={gif}>
                        <img src={gif} alt={gif} />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={styles.App}>
            {/* This was solely added for some styling fanciness */}
            <div className={walletAddress ? `${styles.authedContainer}` : `${styles.container}`}>
                <div className="">
                    <p className={styles.header}>🖼 GIF Portal</p>
                    <p className={styles.subText}>View your GIF collection in the metaverse ✨</p>
                    {!walletAddress && renderNotConnectedContainer()}
                    {walletAddress && renderConnectedContainer()}
                </div>
            </div>
        </div>
    );
}
