import zIndex from "@mui/material/styles/zIndex";
import { borderRadius, boxSizing, fontWeight, lineHeight, textTransform } from "@mui/system";

type Props = {
    options: string[];
    selected: string;
    setSelected: (selected: string) => void;
}

const CustomSwitch = ({ options, selected, setSelected }: Props) => {
    const TAB_WIDTH = `calc((100% - ${1 * (options.length - 1)}rem) / ${options.length})`
    const buttonStyle = {
        width: TAB_WIDTH,
        backgroundColor: "transparent",
        border: "1px solid black",
        color: "black",
        height: "2.5rem",
        lineHeight: "2.5rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "all 0.3s",
        fontWeight: "bold",
        boxSizing: "border-box",
        zIndex: 1,
        userSelect: "none",
    }

    const buttonSelectedStyle = {
        color: "white",
        border: "1px solid transparent",
    }

    const buttonHoverStyle = {
        color: "white",
        backgroundColor: "#7b1fa2",
    }

    // #7b1fa2
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            alignItems: "center",
            width: "100%",
            position: "relative",
        }}>
            {options.map((option) => {
                return (
                    <div
                        key={option}
                        onClick={() => setSelected(option)}
                        style={option === selected ? {
                            ...buttonStyle,
                            ...buttonSelectedStyle
                        } : {
                            ...buttonStyle
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                padding: 0,
                                textAlign: "center",
                                transition: "all 0.3s",
                            }}
                        >{option.toUpperCase()}</p>
                    </div>
                )
            })}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: `calc(((100% - ${1 * (options.length - 1)}rem) / ${options.length})*${options.indexOf(selected)} + ${options.indexOf(selected)}rem)`,
                    height: "2.5rem",
                    width: TAB_WIDTH,
                    backgroundColor: "#9c27b0",
                    transitionDuration: "0.3s",
                    transitionBehavior: "smooth",
                    borderRadius: "0.5rem",
                    zIndex: 0,
                }}
            ></div>
        </div>
    )
}




export default CustomSwitch