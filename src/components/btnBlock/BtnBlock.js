import React from "react";
import CustomButton from "../customButton/CustomButton";

import styles from './btnBlock.module.scss'

const BtnBlock = ({
  className1,
  className2,
  className3,
  className4,
  fnc1,
  fnc2,
  fnc3,
  label1,
  label2,
  label3,
  showThirdButton,
  Children,
}) => {
  return (
    <div className={className4}>
      <CustomButton className={className1} label={label1} onClick={fnc1} />
      {Children && <p className={styles.child}>{Children}</p>}
      <CustomButton className={className2} label={label2} onClick={fnc2} />
      {showThirdButton && (
        <CustomButton className={className3} label={label3} onClick={fnc3} />
      )}
    </div>
  );
};

export default BtnBlock;
