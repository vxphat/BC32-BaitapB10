function dom(selector) {
    return document.querySelector(selector);
}

let staffs = [];

function Staff(tknv, name, email, pass, date, luongCB, chucVu, gioLam) {
    this.tknv = tknv;
    this.name = name;
    this.email = email;
    this.pass = pass;
    this.date = date;
    this.luongCB = luongCB;
    this.chucVu = chucVu;
    this.gioLam = gioLam;

    Staff.prototype.calcLuong = function () {
        let tongLuong = 0;
        let luong = this.luongCB * this.gioLam;

        if (this.chucVu === "Giám đốc") {
            tongLuong = (luong * 3).toLocaleString();
        } else if (this.chucVu === "Trưởng phòng") {
            tongLuong = (luong * 2).toLocaleString();
        } else {
            tongLuong = luong.toLocaleString();
        }
        return tongLuong;
    }

    Staff.prototype.calcXL = function () {
        let XL = "";
        if (this.chucVu === "Nhân viên") {
            if (this.gioLam >= 192) {
                XL = "Nhân viên Xuất sắc";
            } else if (this.gioLam >= 176) {
                XL = "Nhân viên Giỏi";
            } else if (this.gioLam >= 160) {
                XL = "Nhân viên Khá";
            } else if (this.gioLam < 160) {
                XL = "Nhân viên Trung bình";
            } else {
                XL = "";
            }
        }

        return XL;
    }
}

function display(staffs) {
    let html = staffs.reduce((result, staff) => {
        return result + `
        <tr>
            <td>${staff.tknv}</td>
            <td>${staff.name}</td>
            <td>${staff.email}</td>
            <td>${staff.date}</td>
            <td>${staff.chucVu}</td>
            <td>${staff.calcLuong()}</td>
            <td>${staff.calcXL()}</td>
            <td>
                <button onclick="selectStaff('${staff.tknv}')" class="btn btn-success" data-toggle="modal" data-target="#myModal">
               Edit
                </button>

                <button type="button" class="btn btn-danger" onclick="deleteNV('${staff.tknv}')">
                Delete
                </button>
            </td>
        </tr>
        
        `
    }, "");
    dom('#tableDanhSach').innerHTML = html;
}

function selectStaff(staffTKNV) {
    let staff = staffs.find((staff) => {
        return staff.tknv === staffTKNV;
    })

    if (!staff) {
        return
    }

    dom('#tknv').value = staff.tknv;
    dom('#name').value = staff.name;
    dom('#email').value = staff.email;
    dom('#password').value = staff.pass;
    dom('#datepicker').value = staff.date;
    dom('#luongCB').value = staff.luongCB;
    dom('#chucVu').value = staff.chucVu;
    dom('#gioLam').value = staff.gioLam;

    dom("#tknv").disabled = true;
    dom("#btnThemNV").disabled = true;

}


function addStaff() {
    //B1: DOM
    let tknv = dom('#tknv').value;
    let name = dom('#name').value;
    let email = dom('#email').value;
    let pass = dom('#password').value;
    let date = dom('#datepicker').value;
    let luongCB = +dom('#luongCB').value;
    let chucVu = dom('#chucVu').value;
    let gioLam = +dom('#gioLam').value;

    // let isValid = validateForm();
    // // kiểm tra nếu form không hợp lệ => kết thúc hàm
    // if (!isValid){
    //     return;
    // }

    //B2: tạo object

    let staff = new Staff(tknv, name, email, pass, date, luongCB, chucVu, gioLam);
    console.log(staff);

    //B3: thêm object vào arr staffs
    staffs.push(staff);
    localStorage.setItem('staffs', JSON.stringify(staffs));

    //B4: Hiển thị ra table
    display(staffs);

    //B5: Reset Form
    resetForm();
}

function resetForm() {
    dom('#tknv').value = "";
    dom('#name').value = "";
    dom('#email').value = "";
    dom('#password').value = "";
    // dom('#datepicker').value = "";
    dom('#luongCB').value = "";
    dom('#chucVu').value = "Chọn chức vụ";
    dom('#gioLam').value = "";

    dom('#tknv').disabled = false;
    dom("#btnThemNV").disabled = false;

}

function updateForm() {
    //B1: DOM
    let tknv = dom('#tknv').value;
    let name = dom('#name').value;
    let email = dom('#email').value;
    let pass = dom('#password').value;
    let date = dom('#datepicker').value;
    let luongCB = +dom('#luongCB').value;
    let chucVu = dom('#chucVu').value;
    let gioLam = +dom('#gioLam').value;

    //B2: Tạo các object staff chứa các thông tin trên
    let staff = new Staff(tknv, name, email, pass, date, luongCB, chucVu, gioLam)
    console.log(staff);

    //B3: Cập nhật thông tin nhân viên và lưu trữ vào localStorage
    let index = staffs.findIndex((item) => item.tknv === staff.tknv);
    staffs[index] = staff;
    localStorage.setItem('staff', JSON.stringify(staffs))

    //B4: hiện thị ra giao diện
    display(staffs);

    //B5: reset form
    resetForm();
}

dom('#btnTimNV').onclick = function () {
    //DOM
    let searchValue = dom('#searchName').value;

    // if(!searchValue){
    //     display(staffs);
    //     return
    // }

    searchValue = searchValue.toLowerCase()

    let newStaffs = staffs.filter((staff) => {
        let XL = staff.XL.toLowerCase()
        return XL.includes(searchValue);
    });
    display(newStaffs);

}

function deleteNV(staffTKNV) {
    staffs = staffs.filter((staff) => {
        return staff.tknv != staffTKNV;
    })

    localStorage.setItem('staff', JSON.stringify(staffs))

    display(staffs);

}

//=====VALIDATION

function validateTknv() {
    let tknv = dom('#tknv').value;
    let spanEl = dom('#tbTKNV');

    if (!tknv) {
        spanEl.innerHTML = "Tài khoản NV không được để trống"
        return false;
    }

    if (tknv.length < 4 || tknv.length > 8) {
        spanEl.innerHTML = "Tài khoản NV phải từ 4-8 ký tự";
        return false;
    }

    spanEl.innerHTML = ""
    return true;
}

function validateName() {
    let name = dom('#name').value;
    let spanEl = dom('#tbTen');

    if (!name) {
        spanEl.innerHTML = "Tên NV không được để trống";
        return false;
    }

    // Kiểm tra ký tự nhập vào name
    let regex = /^[a-zA-Z\s]*$/
    if (!regex.test(name)) {
        spanEl.innerHTML = "Tên nhân viên phải là chữ";
        return false;
    }
    spanEl.innerHTML = "";
    return true;

}

function validateEmail() {
    let email = dom("#email").value;
    let spanEl = dom("#tbEmail");

    if (!email) {
        spanEl.innerHTML = "Email không được để trống"
        return false;
    }
    //Kiểm tra định dạng của email
    let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    if (!regex.test(email)) {
        spanEl.innerHTML = "Email không đúng định dạng"
        return false;
    }
    spanEl.innerHTML = "";
    return true;
}

function validatePassword() {
    let pass = dom("#password").value;
    let spanEl = dom("#tbMatKhau");

    if (!pass) {
        spanEl.innerHTML = "Chưa điền mật khẩu"
        return false;
    }

    //Kiểm tra định dạng của mật khẩu (1 số, 1 chữ thường, 1 chữ hoa, ít nhất 8 ký tự)
    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

    if (!regex.test(pass)) {
        spanEl.innerHTML = "Mật khẩu không đúng định dạng";
        return false;
    }
    spanEl.innerHTML = "";
    return true;
}

function validateDate(){
    let date = dom("#datepicker").value;
    let spanEl = dom("#tbNgay");

    if (!date) {
        spanEl.innerHTML = "Chưa điền ngày vào làm"
        return false;
    }

    //Kiểm tra định dạng của mật khẩu (1 số, 1 chữ thường, 1 chữ hoa, ít nhất 8 ký tự)
    let regex = /(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/;

    if (!regex.test(date)) {
        spanEl.innerHTML = "Ngày tháng không đúng định dạng";
        return false;
    }
    spanEl.innerHTML = "";
    return true;
}

function validateLuongCB(){
    let luongCB = dom("#luongCB").value;
    let spanEl = dom("#tbLuongCB");

    if (!luongCB) {
        spanEl.innerHTML = "Lương CB không được để trống"
        return false;
    }

     if (luongCB < 1000000 && luongCB > 20000000){
        spanEl.innerHTML = "Lương CB phải từ 1 triệu - 20 triệu";
        return false;
     }

     spanEl.innerHTML = "";
     return true;
}

function validateGioLam(){
    let gioLam = dom("#gioLam").value;
    let spanEl = dom("#tbGiolam");

    if (!gioLam) {
        spanEl.innerHTML = "Số giờ làm không được để trống"
        return false;
    }

     if (gioLam < 80 && gioLam > 200){
        spanEl.innerHTML = "Số giờ làm phải từ 80 giờ - 200 giờ";
        return false;
     }

     spanEl.innerHTML = "";
     return true;
}



function validateForm() {
    //Đặt cờ hiệu
    let isValid = true;

    isValid = validateTknv() & validateName() & validateEmail() & validatePassword() & validateDate() & validateLuongCB() & validateGioLam();

    if (!isValid) {
        return false;
    }

    return true;
}