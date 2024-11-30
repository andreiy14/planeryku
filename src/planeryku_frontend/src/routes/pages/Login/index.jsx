import React from 'react';
import { useForm } from 'react-hook-form';
import setUserName from './useSetUserName';

function LoginPage() {
  const { onSubmit, isLoading } = setUserName();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col w-[345px] h-[325px]   gap-10 rounded-[9px] border-t border-transparent bg-[#FFFFFF] shadow-xl p-6">
        <div className="flex flex-col">
          <span className="text-center text-[#000000] font-semibold">
            Welcome To <span className="text-[#513681]">Planery</span>Ku
          </span>
          <span className="font-normal text-[11px] text-center">
            Fill the form and manage your universe with PlanetaryKu
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" h-full justify-between flex flex-col"
        >
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-bold mb-2 text-xs "
            >
              Username <span className="text-red-500">*</span>
            </label>
            <input
              {...register('username', {
                required: 'This field is required',
              })}
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-2">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex items-end">
            <button
              disabled={isLoading}
              className="bg-[#513681] hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline bottom-0"
              type="submit"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
