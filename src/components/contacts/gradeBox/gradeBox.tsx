import React, { useRef } from "react";
import { IonGrid } from "@ionic/react";
import "./gradeBox.css";
import { FlexboxGrid, Checkbox } from "rsuite";

//redux
import { connect } from "react-redux";

const GradeBox: React.FC<{ grade: boolean; close: any, grades: any[], onSelect: Function }> = ({
  grade,
  close,
  grades,
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
      style={{ display: grade ? "block" : "none", width: "fit-content" }}
    >
      {grades.map((grade: any, i: number) => (
        <FlexboxGrid className="GradeBoxItem" key={i}>
          <Checkbox className="checkSmall" onChange={(value, checked)=> onSelect(value, checked)} value={grade.id}> {grade.gradeName}
          </Checkbox>
        </FlexboxGrid>
      ))}
    </IonGrid>
  );
};

const mapStateToProps = (state: any) => ({
  grades: state.grades.grades,
});
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(GradeBox);