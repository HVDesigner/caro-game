/**
 * Game Core
 *
 * @param {Array} caroTable
 * @param {("block-head" | "gomoku")} type
 * @param {("6-no-win" | "6-win")} rule
 */
function GamePlay(caroTable, type = "block-head", rule = "6-no-win") {
  /**
   *
   * -------------------------------------------------------------------------------------
   * Chức năng kiểm tra xung quanh để tìm người thắng.
   * @param {number} rowkey
   * @param {number} colkey
   */
  const checkAround = (rowkey, colkey) => {
    /**
     * -----------------------------------------------------------------------------
     *
     * Hàng dọc.
     */
    if (
      countPoint(getNorthToSouth(colkey)).winner === 1 ||
      countPoint(getNorthToSouth(colkey)).winner === 2
    ) {
      // Nếu có người thắng.
      return {
        isPlay: false,
        winner: countPoint(getNorthToSouth(colkey)).winner,
      };
    }

    /**
     * -----------------------------------------------------------------------------
     *
     * Hàng ngang.
     */
    if (
      countPoint(getWestToEast(rowkey)).winner === 1 ||
      countPoint(getWestToEast(rowkey)).winner === 2
    ) {
      // Nếu có người thắng.
      return {
        isPlay: false,
        winner: countPoint(getWestToEast(rowkey)).winner,
      };
    }

    /**
     * -----------------------------------------------------------------------------
     *
     * Chéo trái.
     */
    if (
      countPoint(getNorthwestToSoutheast(rowkey, colkey)).winner === 1 ||
      countPoint(getNorthwestToSoutheast(rowkey, colkey)).winner === 2
    ) {
      // Nếu có người thắng.
      return {
        isPlay: false,
        winner: countPoint(getNorthwestToSoutheast(rowkey, colkey)).winner,
      };
    }

    /**
     * -----------------------------------------------------------------------------
     *
     * Chéo phải.
     */
    if (
      countPoint(getNortheastToSouthwest(rowkey, colkey)).winner === 1 ||
      countPoint(getNortheastToSouthwest(rowkey, colkey)).winner === 2
    ) {
      // Nếu có người thắng.
      return {
        isPlay: false,
        winner: countPoint(getNortheastToSouthwest(rowkey, colkey)).winner,
      };
    }

    return {
      isPlay: true,
      winner: "",
    };
  };

  /**
   *
   * --------------------------------------------------------------------------------------
   * Chức năng tìm người thắng trong 1 hàng bất kỳ.
   *
   * @param {Array} arr
   */
  const countPoint = (arr) => {
    /**
     * -------------------------------------------------------------------------------------
     * Tìm người thắng với giá trị 1 (X).
     */
    const maxOnePoint = () => {
      let max = 0;
      let count = 0;

      if (type === "block-head") {
        let indexArr = [];
        let indexMaxArr = [];

        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element === 1) {
            indexArr.push(index);
            count++;
            if (count > max) {
              indexMaxArr = indexArr;
              max = count;
            }
          } else {
            indexArr = [];
            count = 0;
          }
        }

        let headCheck = 0;

        if (arr[indexMaxArr[0] - 1] === 2) {
          headCheck = headCheck + 1;
        }

        if (arr[indexMaxArr[indexMaxArr.length - 1] + 1] === 2) {
          headCheck = headCheck + 1;
        }

        if (headCheck === 2) return 0;
      } else {
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element === 1) {
            count++;
            if (count > max) {
              max = count;
            }
          } else {
            count = 0;
          }
        }
      }

      // Check Rule 6 Win
      if (rule === "6-no-win" && max > 5) {
        return 0;
      }

      return max;
    };

    /**
     * ------------------------------------------------------------------------------------
     * TÌm người thắng với giá trị 2 (O).
     */
    const maxTwoPoint = () => {
      let max = 0;
      let count = 0;

      if (type === "block-head") {
        let indexArr = [];
        let indexMaxArr = [];

        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element === 2) {
            indexArr.push(index);
            count++;
            if (count > max) {
              indexMaxArr = indexArr;
              max = count;
            }
          } else {
            indexArr = [];
            count = 0;
          }
        }

        let headCheck = 0;
        console.log(JSON.stringify(indexMaxArr));

        if (arr[indexMaxArr[0] - 1] === 1) {
          headCheck = headCheck + 1;
        }

        if (arr[indexMaxArr[indexMaxArr.length - 1] + 1] === 1) {
          headCheck = headCheck + 1;
        }

        if (headCheck === 2) return 0;
      } else {
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index];
          if (element === 2) {
            count++;
            if (count > max) {
              max = count;
            }
          } else {
            count = 0;
          }
        }
      }

      // Kiểm tra luật 6 quân không thắng.
      if (rule === "6-no-win" && max > 5) return 0;

      return max;
    };

    /**
     * ------------------------------------------------------------------------------------
     * Nếu như có người thắng với giá trị 1 (X), thì trả về { winner: 1 }.
     */
    if (maxOnePoint() >= 5) return { winner: 1 };

    /**
     * -------------------------------------------------------------------------------------
     * Nếu như có người thắng với giá trị 2 (O), thì trả về { winner: 2 }.
     */
    if (maxTwoPoint() >= 5) return { winner: 2 };

    /**
     * -------------------------------------------------------------------------------------
     * Nếu như chưa có người thắng, thì trả về { winner: '' }.
     */
    return { winner: "" };
  };

  /**
   *
   * ----------------------------------------------------------------------------------------
   * Chức năng lấy mảng hàng dọc.
   *
   * @param {number} colkey
   */
  const getNorthToSouth = (colkey) => {
    let arr = [];
    for (let index = 0; index < caroTable.length; index++) {
      const element = caroTable[index];
      arr.push(element[colkey]);
    }

    return arr;
  };

  /**
   *
   * ----------------------------------------------------------------------------------------
   * Chức năng lấy mảng hàng ngang.
   *
   * @param {number} rowkey
   */
  const getWestToEast = (rowkey) => {
    let arr = [];
    arr = caroTable[rowkey];

    return arr;
  };

  /**
   *
   * -----------------------------------------------------------------------------------------
   * Chức năng lấy mảng chéo trái.
   *
   * @param {number} rowkey
   * @param {number} colkey
   */
  const getNorthwestToSoutheast = (rowkey, colkey) => {
    let finalArr = [];

    const checkNorthwest = () => {
      let arr = [];
      // rowkey - 1
      // colkey - 1
      let rowkeyNorthwest = rowkey;
      let colkeyNorthwest = colkey;

      if (rowkey !== 0 && colkey !== 0) {
        do {
          rowkeyNorthwest = rowkeyNorthwest - 1;
          colkeyNorthwest = colkeyNorthwest - 1;

          arr.unshift(caroTable[rowkeyNorthwest][colkeyNorthwest]);
        } while (rowkeyNorthwest > 0 && colkeyNorthwest > 0);
      }

      return arr;
    };

    const checkSoutheast = () => {
      let arr = [];
      // rowkey + 1
      // colkey + 1
      let rowkeySoutheast = rowkey;
      let colkeySoutheast = colkey;

      if (
        rowkey !== caroTable.length - 1 &&
        colkey !== caroTable[0].length - 1
      ) {
        do {
          rowkeySoutheast = rowkeySoutheast + 1;
          colkeySoutheast = colkeySoutheast + 1;

          arr.push(caroTable[rowkeySoutheast][colkeySoutheast]);
        } while (
          rowkeySoutheast < caroTable.length - 1 &&
          colkeySoutheast < caroTable[0].length - 1
        );
      }

      return arr;
    };

    if (checkNorthwest().length === 0) {
      finalArr = [caroTable[rowkey][colkey]].concat(checkSoutheast());
    } else if (checkSoutheast().length === 0) {
      finalArr = checkNorthwest().concat([caroTable[rowkey][colkey]]);
    } else {
      finalArr = checkNorthwest()
        .concat([caroTable[rowkey][colkey]])
        .concat(checkSoutheast());
    }

    return finalArr;
  };

  /**
   * ------------------------------------------------------------------------------------------
   * Chức năng lấy mảng chéo phải.
   *
   * @param {number} rowkey
   * @param {number} colkey
   */
  const getNortheastToSouthwest = (rowkey, colkey) => {
    /**
     * Khởi tạo giá trị mảng đích.
     */
    let finalArr = [];

    const checkNortheast = () => {
      const arr = [];

      let rowkeyNortheast = rowkey;
      let colkeyNortheast = colkey;

      if (rowkey !== 0 && colkey !== caroTable[0].length - 1) {
        do {
          rowkeyNortheast = rowkeyNortheast - 1;
          colkeyNortheast = colkeyNortheast + 1;

          arr.unshift(caroTable[rowkeyNortheast][colkeyNortheast]);
        } while (
          rowkeyNortheast > 0 &&
          colkeyNortheast < caroTable[0].length - 1
        );
      }

      return arr;
    };

    const checkSouthwest = () => {
      const arr = [];

      let rowkeySouthwest = rowkey;
      let colkeySouthwest = colkey;

      if (rowkey !== caroTable.length - 1 && colkey !== 0) {
        do {
          rowkeySouthwest = rowkeySouthwest + 1;
          colkeySouthwest = colkeySouthwest - 1;

          arr.push(caroTable[rowkeySouthwest][colkeySouthwest]);
        } while (rowkeySouthwest < caroTable.length - 1 && colkeySouthwest > 0);
      }

      return arr;
    };

    if (checkNortheast().length !== 0)
      finalArr = finalArr.concat(checkNortheast());

    finalArr = finalArr.concat(caroTable[rowkey][colkey]);

    if (checkSouthwest().length !== 0)
      finalArr = finalArr.concat(checkSouthwest());

    return finalArr;
  };

  /**
   *
   * ------------------------------------------------------------------------------------------
   * Trả về chức năng kiểm tra xung quanh để tìm người thắng.
   */
  return { checkAround };
}

export default GamePlay;
