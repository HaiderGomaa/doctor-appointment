import { useState, useEffect } from 'react'
function States() {
    const [doctorCount, setDoctorCount] = useState(0);
    const [departmentCount, setDepartmentCount] = useState(0);

    useEffect(() => {
        // Simulate an API call to fetch state data
        const fetchData = async () => {
            // Replace this with your actual API call
            try {
                const doctorResponse = await fetch("http://localhost:5000/api/doctors/countDoctors");
                const doctorData = await doctorResponse.json();
                setDoctorCount(doctorData.count||0);

                const departmentResponse = await fetch("http://localhost:5000/api/departments/countDepertments");
                const departmentData = await departmentResponse.json();
                setDepartmentCount(departmentData.count||0);
            } catch (error) {
                console.error("Error fetching state data:", error);
            }
        }
        fetchData();
    }, []);
const states = [
    {icons: "fas fa-user-md", title: "Doctors", count: doctorCount},
    {icons: "fas fa-hospital", title: "Departments", count: departmentCount},
    {icons: "fas fa-calendar-check", title: "Appointments", count: 120},
    {icons: "fas fa-users", title: "Patients", count: 300},
] 
  return (
    <section className="bg-gray-150 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {states.map((state, index) => (
            <div className="bg-white rounded-lg shadow p-6 text-center hover:scale-105 transition-transform duration-300 hover:bg-[#0097a6]" key={index}>
              <i className={`${state.icons} text-[#007bff] mb-2 text-4xl`}></i>
              <h3 className="text-xl font-bold mb-2">{state.title}</h3>
              <p className="text-3xl font-bold">{state.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default States


