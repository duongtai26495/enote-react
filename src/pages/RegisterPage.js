import React, { useState } from 'react'

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('UNKNOWN'); // Mặc định là UNKNOWN

    const handleRegister = () => {
        // Xử lý đăng ký ở đây
    };

    return (
        <div style={{ backgroundImage: `url(https://source.unsplash.com/random)` }} 
        className="bg-page min-h-screen flex items-center justify-center bg-cover bg-center bg-indigo-600">
            <div className="bg-white p-8 rounded-lg shadow-lg mx-2 md:w-96">
                <h2 className="text-2xl font-semibold mb-4">Đăng ký</h2>
                <div className='flex gap-3'>
                    <input
                        type="text"
                        placeholder="Họ"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mb-2 p-2 border rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="Tên"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mb-2 p-2 border rounded-lg w-full"
                    />
                </div>
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-2 p-2 border rounded-lg w-full"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-2 p-2 border rounded-lg w-full"
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-2 p-2 border rounded-lg w-full"
                />
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-2 p-2 border rounded-lg w-full"
                />
                <div className="mb-2 w-full flex items-center">
                    <label className='w-full'>Giới tính:</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="UNKNOWN">Không xác định</option>
                    </select>
                </div>
                <div className="mt-4 flex flex-col w-full">
                    <button onClick={handleRegister} className="bg-indigo-500 w-full text-white px-4 py-2 rounded-lg mr-2">
                        Đăng ký
                    </button>
                    <a href="/login" className="text-gray-500 my-3 hover:text-indigo-800">Quay lại trang đăng nhập</a>
                </div>
                <div className="mt-4 flex">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">Đăng ký với Facebook</button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Đăng ký với Google</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage