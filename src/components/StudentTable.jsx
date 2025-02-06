import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentModal from "./StudentModal";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [modalData, setModalData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acknowledgment, setAcknowledgment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/students"
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleEdit = (student) => {
    setModalData(student);
    setOriginalData(student);
    setIsEditing(true);
    setIsModalOpen(true);
    setAcknowledgment(null);
  };

  const handleAdd = () => {
    setModalData({ name: "", age: "", studentClass: "", phoneNumber: "" });
    setIsEditing(false);
    setIsModalOpen(true);
    setAcknowledgment(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      console.log("Deleting student with ID:", id); 
      try {
        await axios.delete(
          `http://localhost:8080/students/${id}`
        );
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error.response || error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const isDataChanged = Object.keys(modalData).some(
          (key) => modalData[key] !== originalData[key]
        );

        if (!isDataChanged) {
          setAcknowledgment("No values have been updated.");
          return;
        }
        console.log(modalData);

        axios
          .put(
            "http://localhost:8080/students/updatestudent",
            modalData
          )
          .then((response) => {
            console.log("Student updated successfully:", response.data);
            startCountdown(`Updated successfully with ID: ${response.data.id}`);
          })
          .catch((error) => {
            console.log("Errrrrrrrrrr...........")
            console.error("Error updating student:", error);
          });
        
      } else {
        const response = await axios.post(
          "http://localhost:8080/students/addstudent",
          modalData
        );
        console.log(response.data.id);
        startCountdown(`Added successfully with ID: ${response.data.id}`);
      }
      setModalData(null);
      fetchStudents();
    } catch (error) {
      console.error("Error:", error);
      setAcknowledgment("An error occurred. Please try again.");
    }
  };

  const startCountdown = (message) => {
    let countdown = 5;
    setAcknowledgment(
      <>
        {message} -{" "}
        <span style={{ color: "red" }}>Redirecting in {countdown}...</span>
      </>
    );

    const interval = setInterval(() => {
      countdown -= 1;
      if (countdown > 0) {
        setAcknowledgment(
          <>
            {message} -{" "}
            <span style={{ color: "red" }}>Redirecting in {countdown}...</span>
          </>
        );
      } else {
        clearInterval(interval);
        setIsModalOpen(false);
        setAcknowledgment(null);
      }
    }, 1000);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Student Management</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name..."
        value={search}
        onChange={handleSearch}
      />
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        Add Student
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Class</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">
                <div className="d-flex flex-column align-items-center">
                  <span className="spinner-border text-primary"></span>
                  <p>Fetching data from database...</p>
                </div>
              </td>
            </tr>
          ) : students.length === 0 ||
            students.filter((s) =>
              s.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No records found
              </td>
            </tr>
          ) : (
            students
              .filter((s) =>
                s.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.studentClass}</td>
                  <td>{student.phoneNumber}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>

      {/* StudentModal */}
      <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {acknowledgment && (
          <div className="alert alert-success" role="alert">
            {acknowledgment}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={modalData?.name || ""}
              onChange={(e) =>
                setModalData({ ...modalData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="text"
              className="form-control"
              value={modalData?.age || ""}
              onChange={(e) =>
                setModalData({ ...modalData, age: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Class</label>
            <input
              type="text"
              className="form-control"
              value={modalData?.studentClass || ""}
              onChange={(e) =>
                setModalData({ ...modalData, studentClass: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={modalData?.phoneNumber || ""}
              onChange={(e) =>
                setModalData({ ...modalData, phoneNumber: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            {isEditing ? "Update" : "Add"}
          </button>
        </form>
      </StudentModal>
    </div>
  );
};

export default StudentTable;
