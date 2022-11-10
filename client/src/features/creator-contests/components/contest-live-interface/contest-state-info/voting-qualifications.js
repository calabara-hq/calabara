import { useSelector } from "react-redux";
import { selectIsConnected } from "../../../../../app/sessionReducer";
import { useWalletContext } from "../../../../../app/WalletContext";
import { TagType, TokenType } from "../../../../../css/token-button-styles";
import { Contest_h4 } from "../../common/common_styles";
import { selectContestSettings } from "../interface/contest-interface-reducer";
import { ConnectWalletButton, DataGrid, DataWrap, GridElement } from "./styles";


export default function VotingQualifications() {
    const contest_settings = useSelector(selectContestSettings)
    const isWalletConnected = useSelector(selectIsConnected)
    const { walletConnect } = useWalletContext();

    return (
        <DataWrap>
            <GridElement>
                <div><Contest_h4>My Voting Eligibility</Contest_h4></div>
                <div>{!isWalletConnected && <ConnectWalletButton onClick={walletConnect}>Connect</ConnectWalletButton>}</div>
            </GridElement>
            {contest_settings.voter_restrictions.length > 0 &&
                <DataGrid>
                    {contest_settings.voter_restrictions.length > 1 && <p style={{ color: '#a3a3a3' }}>must satisfy at least one of:</p>}
                    {contest_settings.voter_restrictions.map((restriction, idx) => {
                        return (
                            <GridElement key={idx}>
                                <div><p>{restriction.threshold} {restriction.symbol}</p></div>
                                <div><TokenType><TagType type={restriction.type}>{restriction.type}</TagType></TokenType></div>
                            </GridElement>
                        )
                    })}
                </DataGrid>
            }
        </DataWrap>
    )
}