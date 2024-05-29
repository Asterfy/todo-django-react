import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { createTask, deleteTask, updateTask, getTask } from "../api/task.api";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async (data) => {
    if (params.id) {
      await updateTask(params.id, data);
      toast.success("Tarea actualizada", {
        position: "top-right",
        style: {
          border: "1px solid green",
          padding: "16px",
          color: "green",
        },
      });
    } else {
      await createTask(data);
      toast.success("Tarea creada", {
        position: "top-right",
        style: {
          border: "1px solid green",
          padding: "16px",
          color: "green",
        },
      });
    }
    navigate("/tasks");
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        // console.log("Obteniendo datos")
        const res = await getTask(params.id);
        setValue("title", res.data.title);
        setValue("description", res.data.description);
      }
    }
    loadTask();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="title"
          {...register("title", { required: true })}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
        />
        {errors.title && <span>Title is required</span>}
        <textarea
          rows="3"
          placeholder="description"
          {...register("description", { required: true })}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
        ></textarea>
        {errors.description && <span>Description is required</span>}
        <button className="bg-indigo-500 p-3 rounded-lg block w-full mt-3 hover:bg-indigo-600">
          Save
        </button>
      </form>

      {params.id && (
        <div className="flex justify-end">
          <button
            onClick={async () => {
              const accepted = window.confirm("Desea eliminar la tarea?");
              if (accepted) {
                await deleteTask(params.id);
                toast.success("Tarea eliminada", {
                  position: "top-right",
                  style: {
                    border: "1px solid green",
                    padding: "16px",
                    color: "green",
                  },
                });
                navigate("/tasks");
              }
            }}
            className="bg-red-500 p-3 rounded-lg w-48 mt-3"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskFormPage;
