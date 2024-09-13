import React, { useEffect, useState } from 'react';

export default function TodoList() {
  //#region Nững State dùng chung của ứng dụng
  const [listJob, setListJob] = useState(() => {
    const jobLocal = JSON.parse(localStorage.getItem('jobs')) || [];
    return jobLocal;
  });
  const [jobName, setJobName] = useState(''); //Tên công việc
  const [isShowError, setIsShowError] = useState(false); // lỗi

  const [editListJob, setEditListJob] = useState(null); // Mã công việc cần sửa

  //#endregion

  /**
   * Validate dữ liệu đầu vào
   * @param {*} value dữ liệu cần kiểm tra
   * @returns true: Khi không có lỗi, False khi có lỗi
   * Auth: NTSon (13/09/2024)
   */
  const validateData = (value) => {
    let isValid = true;
    if (!value) {
      setIsShowError(true);
      isValid = false;
    } else {
      setIsShowError(false);
    }
    return isValid;
  };

  /**
   * Lấy giá trị từu input
   * @param {*} e Thông tin từ sự kiện
   * Auth: NTSon (13/09/2024)
   */
  const handleChange = (e) => {
    const { value } = e.target;
    setJobName(value);

    validateData(value);
  };

  //Thêm mới công việc
  const handleAddJob = () => {
    //Validate dữ liệu đầu vào
    const isValid = validateData(jobName);

    if (isValid) {
      //submit form
      //Tạo đối tượng job
      const jobInfo = {
        id: Math.ceil(Math.random() * 10000),
        name: jobName,
        status: false,
      };

      //push đối tượng vào mẳng
      listJob.push(jobInfo);
      saveData('jobs', listJob);

      //Clean giá trị trong input
      setJobName('');
    }
  };

  /**
   *Hàm Xóa 1 công việc
   * @param {*} id Id cần xóa
   * @param {*} name tên công việc cần xóa
   * Auth: NTSon (13/09/2024)
   *
   */
  const handleShowConfirm = (id, name) => {
    const isConfirm = confirm(`Bạn có chắc chắn muốn xóa công việc "${name}" này không`);

    if (isConfirm) {
      //Tiến hành xóa công việc

      //Lọc ra những bản ghi có id khác với id cần xóa [1, 2, 3, 4] . Xóa 1 = > [2, 3, 4]
      const filterJob = listJob.filter((item) => item.id !== id);

      saveData('jobs', filterJob);
    }
  };

  /**
   * Thay đổi trạng thái status
   * @param {*} id tìm Id cần thay đổi trạng thái
   * kiểm tra xem có tồn tại id ko nếu có thì thay đổi và ngược lại
   * Auth: NTSon (13/09/2024)
   */
  const handleChangeStatus = (id) => {
    //Tìm kiếm vị trí của công việc cập nhật
    const findIndexJob = listJob.findIndex((item) => item.id === id);

    if (findIndexJob !== -1) {
      //Cập nhật lại trạng thái công việc

      listJob[findIndexJob].status = !listJob[findIndexJob].status;
    }

    const newArray = [...listJob];
    saveData('jobs', newArray);
  };

  /**
   * Xử lý chỉnh sửa công việc từ danh sách
   * @param {*} id ID của công việc cần chỉnh sửa.
   * Auth: 13/09/2024
   */
  const handleEditListJob = (id) => {
    //Timf kiếm công việc cần sửa
    const jobEditIndex = listJob.find((item) => item.id === id);
    if (jobEditIndex) {
      setJobName(jobEditIndex.name);
      setEditListJob(id);
    }
  };

  const handleEditJob = () => {
    const isValid = validateData(jobName);
    if (isValid && editListJob !== null) {
      const updatedJobs = listJob.map((item) => {
        if (item.id === editListJob) {
          return { ...item, name: jobName }; // Cập nhật tên công việc
        }
        return item;
      });

      saveData('jobs', updatedJobs);
      setJobName(''); //cho ô input về rỗng
      setEditListJob(null); // Reset ID sửa
    }
  };

  /**
   * Lưu dữ liệu vào localStorage và cập nhật danh sách công việc.
   *
   * @param {string} key - Khóa để lưu trữ dữ liệu trong localStorage.
   * @param {Array} array - Mảng dữ liệu cần lưu trữ.
   * Auth: NTSon 13/09/2024
   */
  function saveData(key, array) {
    // Chuyển đổi mảng thành chuỗi JSON và lưu vào localStorage theo khóa đã cho
    localStorage.setItem(key, JSON.stringify(array));

    // Cập nhật danh sách công việc bằng cách gọi hàm setListJob với mảng đã lưu
    setListJob(array);
  }

  return (
    <>
      <div>
        <input className="input" type="text" name="jobName" value={jobName} onChange={handleChange} />

        {editListJob ? (
          <button className="btn btn-edit" onClick={handleEditJob}>
            Sửa
          </button>
        ) : (
          <button className="btn btn-add" onClick={handleAddJob}>
            Thêm
          </button>
        )}
      </div>
      {isShowError && <p>Tên công việc không được để trống</p>}

      <ul>
        {listJob.map((item) => (
          <li className="item" key={item.id}>
            <input
              className="checkbox"
              checked={item.status}
              onChange={() => handleChangeStatus(item.id)}
              type="checkbox"
            />

            {item.status ? <s className="name">{item.name}</s> : <span className="name">{item.name}</span>}

            <button className="btn btn-edit" onClick={() => handleEditListJob(item.id)}>
              Sửa
            </button>
            <button className="btn btn-add" onClick={() => handleShowConfirm(item.id, item.name)}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
