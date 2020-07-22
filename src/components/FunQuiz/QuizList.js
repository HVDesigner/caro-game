/**
 * Cập nhật câu hỏi mới phải xóa fun-quiz collection để reset.
 */

const quizList = [
  {
    title: `1. Trên tay cầm một cây thước và một cây bút, làm thế nào để bạn vẽ được một vòng tròn thật chính xác ?`,
    result: [
      { title: "Bỏ cây thước đi và cầm compa lên rồi vẽ.", type: true },
      {
        title: "Chọn 2 điểm trên thước và xoay quanh 1 điểm cố định.",
        type: false,
      },
    ],
  },
  {
    title: `2. Từ nào trong tiếng Việt có 9 ký tự "h" ?`,
    result: [
      { title: "Không có từ nào.", type: false },
      {
        title: "Chính.",
        type: true,
      },
    ],
  },
  {
    title: `3. Có cổ nhưng không có miệng là gì ?`,
    result: [
      { title: "Cái chai.", type: false },
      {
        title: "Cái áo.",
        type: true,
      },
    ],
  },
  {
    title: `4. Điền số thích hợp ? 
      1+4 =5
      2+5=12
      3+6=21
      8+11=?
      `,
    result: [
      { title: "35.", type: false },
      {
        title: "96.",
        type: true,
      },
    ],
  },
  {
    title: `5. Mỗi năm có 7 tháng 31 ngày. Đố bạn có nhiêu tháng có 28 ngày ?`,
    result: [
      { title: "12 tháng.", type: true },
      {
        title: "7 tháng.",
        type: false,
      },
    ],
  },
  {
    title: `6. Con gì có thể đủ sức mang cả 1 khúc gỗ nặng 1 tấn, mà không thể mang được 1 viên sỏi ?`,
    result: [
      { title: "Con sông.", type: true },
      {
        title: "Con xe.",
        type: false,
      },
    ],
  },
  {
    title: `7. Giữa trời và đất là cái gì ?`,
    result: [
      { title: `Chữ "và".`, type: true },
      {
        title: "Tầng khí quyển.",
        type: false,
      },
    ],
  },
  {
    title: `8. Từ nào trong tiếng việt có 3 chữ n ?`,
    result: [
      { title: `Ban.`, type: true },
      {
        title: "Không có từ nào.",
        type: false,
      },
    ],
  },
  {
    title: `9. Hai đầu mà chẳng có đuôi nhiều chân mà lại đứng hoài chẳng đi là cái gì ?`,
    result: [
      { title: `Con sông.`, type: false },
      {
        title: "Cây cầu.",
        type: true,
      },
    ],
  },
  {
    title: `10. Một người đàn ông quên mật khẩu gồm 5 chữ số để mở khóa, bạn hãy giúp anh ta tìm lại mật khẩu với điều kiện sau:
      -	Chữ số thứ 5 cộng với chữ số thứ 4 bằng 14
      -	Chữ số đầu tiên nhở hơn 2 lần chữ số thứ 2 một đơn vị
      -	Chữ số thứ 4 lớn hơn chữ số thứ 2 một đơn vị
      -	Chữ cố thứ 2 cộng với chữ số thứ 3 bằng 10
      -	Tổng 5 chữ số bằng 30
      `,
    result: [
      { title: `64658.`, type: false },
      {
        title: "74658.",
        type: true,
      },
    ],
  },
  {
    title: `11. Tìm số trong dấu ?`,
    result: [
      { title: `10.`, type: false },
      {
        title: "5.",
        type: true,
      },
    ],
  },
  {
    title: `12. Một người viết liên tiếp nhóm chữ "Hội quán cờ caro" thành 1 dãy như sau: Hoiquancocarohoiquancocaro...
      Vậy chữ cái thứ 2020 trong dãy trên là chữ gì ?`,
    result: [
      { title: `U.`, type: true },
      {
        title: "C.",
        type: false,
      },
    ],
  },
  {
    title: `13. Đố bạn có bao nhiêu chữ C trong câu sau đây: "Cơm, canh, cháo gì tớ cũng thích ăn"`,
    result: [
      { title: `Có 5 chữ C.`, type: false },
      {
        title: "Có 1 chữ C.",
        type: true,
      },
    ],
  },
  {
    title: `14. Cái gì tay trái cầm được còn tay phải có muốn cầm cũng không được ?`,
    result: [
      { title: `Ngón tay phải.`, type: false },
      {
        title: "Cùi trỏ tay phải.",
        type: true,
      },
    ],
  },
  {
    title: `15. Bức tranh nàng Monalisa, người đẹp này không có gì ?`,
    result: [
      { title: `Không có chân mày.`, type: true },
      {
        title: "Không có chân.",
        type: false,
      },
    ],
  },
  {
    title: `16. Điền số thích hợp ?`,
    result: [
      { title: `90.`, type: true },
      {
        title: "15.",
        type: false,
      },
    ],
  },
  {
    title: `17. Có 3 quả táo trên bàn và bạn lấy đi 2 quả. Hỏi bạn còn bao nhiêu quả táo ?`,
    result: [
      { title: `2 quả táo.`, type: true },
      {
        title: "Không còn quả nào.",
        type: false,
      },
    ],
  },
  {
    title: `18. Chứng minh con gái = con dê`,
    result: [
      {
        title: `Con gái => thiên thần => tiền thân => trước khỉ => mùi => con dê.`,
        type: true,
      },
      {
        title: "Con gái => thiên thần => tiên nhân => tiên nữ => con dê.",
        type: false,
      },
    ],
  },
  {
    title: `19. Nắng 3 năm tôi không bỏ bạn, mưa một ngày sao bạn lại bỏ tôi là cái gì ?`,
    result: [
      {
        title: `Cái bóng.`,
        type: true,
      },
      {
        title: "Cái thằng bạn.",
        type: false,
      },
    ],
  },
  {
    title: `20. Điền số thích hợp vào dấu  ?`,
    result: [
      {
        title: `35.`,
        type: false,
      },
      {
        title: "24.",
        type: true,
      },
    ],
  },
];

export default quizList;
