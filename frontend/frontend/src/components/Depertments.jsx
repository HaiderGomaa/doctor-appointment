import { useEffect, useState } from "react";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/departments/getDepertments"
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Department response must be an array");
        }

        setDepartments(data);

        if (data.length > 0) {
          setActiveTab(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching department data:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  return (
    <section id="departments" className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Expert care, close to you
          </p>
          <h3 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Our Departments
          </h3>
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Explore our specialized departments and the services they offer.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 md:grid md:grid-cols-[260px_minmax(0,1fr)]">
          {isLoading ? (
            <div className="p-8 text-center text-slate-600 md:col-span-2">
              Loading departments...
            </div>
          ) : hasError ? (
            <div className="p-8 text-center text-rose-700 md:col-span-2" role="alert">
              Departments could not be loaded. Please try again later.
            </div>
          ) : departments.length === 0 ? (
            <div className="p-8 text-center text-slate-600 md:col-span-2">
              No departments are available right now.
            </div>
          ) : (
            <>
              <div className="border-b border-slate-200 bg-slate-50 p-3 md:border-b-0 md:border-r md:p-5">
                <ul
                  aria-label="Department categories"
                  className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
                  role="tablist"
                >
                  {departments.map((department) => {
                    const isActive = activeTab === department._id;

                    return (
                      <li className="shrink-0 md:w-full" key={department._id}>
                        <button
                          aria-controls={`department-panel-${department._id}`}
                          aria-selected={isActive}
                          className={`department-tab ${
                            isActive ? "is-active" : ""
                          }`}
                          id={`department-tab-${department._id}`}
                          onClick={() => handleTabClick(department._id)}
                          role="tab"
                          type="button"
                        >
                          {department.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="min-w-0 p-5 sm:p-8 lg:p-10">
                {departments.map((department) => (
                  <div
                    aria-labelledby={`department-tab-${department._id}`}
                    className={activeTab === department._id ? "block" : "hidden"}
                    id={`department-panel-${department._id}`}
                    key={department._id}
                    role="tabpanel"
                    tabIndex={0}
                  >
                    <h4 className="mb-5 text-2xl font-bold text-slate-900 sm:text-3xl">
                      {department.name}
                    </h4>

                    {department.image && (
                      <img
                        alt={department.name}
                        className="mb-6 max-h-96 w-full rounded-xl object-cover"
                        src={`http://localhost:5000/uploads/${department.image}`}
                      />
                    )}

                    <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                      {department.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          </div>
      </div>
    </section>
  );
}

export default Departments;