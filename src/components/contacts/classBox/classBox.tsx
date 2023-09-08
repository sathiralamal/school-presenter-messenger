import React, { useRef } from "react";
import { IonGrid } from "@ionic/react";
import "./classBox.css";
import { FlexboxGrid, Checkbox } from "rsuite";

//redux
import { connect } from "react-redux";

const ClassBox: React.FC<{ classOpen: boolean; close: any, classes: any[], onSelect: Function }> = ({
  classOpen,
  close,
  classes,
  onSelect
}) => {
  // const [change, setChange] = useState<boolean>(false);
  const wrapperRef = useRef<any>(null);

  // useEffect(() => {
  //   document.addEventListener("click", handleClickOutside, false);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, false);
  //   };
  // }, []);

  // const handleClickOutside = (event: any) => {
  //   if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //     close();
  //     console.log("open", close);
  //   }
  // };
  return (
    <IonGrid
      ref={wrapperRef}
      className="GradeBox"
      style={{ display: classOpen ? "block" : "none", width: "fit-content" }}
    >
      {classes.map((item: any, i: number) => (
        <FlexboxGrid className="GradeBoxItem" key={i}>
          <Checkbox className="checkSmall" onChange={(value, checked)=> onSelect(value, checked)} value={item.id}> {item.className}
          </Checkbox>
        </FlexboxGrid>
      ))}
    </IonGrid>
  );
};

const mapStateToProps = (state: any) => ({
  classes: state.classes.classes,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ClassBox);