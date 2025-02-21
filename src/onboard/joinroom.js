import React from 'react'
import JoinGame from './joingame'
import ChessGame from '../chess/ui/chessgame'
import { ethers } from 'ethers';

/**
 * Onboard is where we create the game room.
 */

class JoinRoom extends React.Component {
    state = {
        didGetUserName: true,
        walletAddress: '',
        isConnecting: true,
    };  

    constructor(props) {
        super(props);
        this.textArea = React.createRef();
    }

    checkWalletConnection = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    this.setState({walletAddress: accounts[0]});
                }
                this.setState({isConnecting: false});
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        }
    };

    componentDidMount() {
        this.checkWalletConnection();
    }

    connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected. Please install MetaMask.");
            return;
        }

        this.setState({ isConnecting: true });

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            this.setState({
                walletAddress: address,
                didGetUserName: true,
                isConnecting: false,
            });
        } catch (error) {
            console.error("Error connecting wallet:", error);
            this.setState({ isConnecting: false });
        }
    };

    handleSubmit = async (gameId) => {
        this.setState({
            didGetUserName: true
        })
    }

    render() {
        return (<React.Fragment>
            {
                this.state.walletAddress.length > 0 ? 
                <React.Fragment>
                    <JoinGame userName = {this.state.walletAddress} isCreator = {false}/>
                    <ChessGame myUserName = {this.state.walletAddress}/>
                </React.Fragment>
            :
               <div>
                        <button
                            className="btn btn-primary"
                            style={{
                                marginLeft: `${(window.innerWidth / 2) - 60}px`,
                                width: "200px",
                                marginTop: "62px",
                            }}
                            disabled={this.state.isConnecting}
                            onClick={this.connectWallet}
                        >
                            {this.state.isConnecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                           
                    {/* <button className="btn btn-primary" 
                        style = {{marginLeft: String((window.innerWidth / 2) - 60) + "px", width: "120px", marginTop: "62px"}} 
                        disabled = {!(this.state.walletAddress?.length > 0)} 
                        onClick = {
                            // When the 'Submit' button gets pressed from the username screen,
                            // We should send a request to the server to create a new room with
                            // the uuid we generate here.
                            this.handleSubmit
                        }>Submit</button> */}
                </div>
            }
            </React.Fragment>)
    }
}

export default JoinRoom