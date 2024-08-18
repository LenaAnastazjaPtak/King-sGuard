
type Props = {
    options: string[];
    selected: string;
    setSelected: (selected: string) => void;
}

const CustomSwitch = ({ options, selected, setSelected }: Props) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            alignItems: "center",
            width: "100%",
        }}>
            {options.map((option) => {
                return (
                    <button key={option} onClick={() => setSelected(option)} style={{ backgroundColor: option === selected ? "blue" : "white", color: "black", flex: 1 }}>{option}</button>
                )
            })}
        </div>
    )
}

export default CustomSwitch