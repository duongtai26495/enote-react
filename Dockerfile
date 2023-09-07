# Sử dụng một hình ảnh chứa Node.js phiên bản LTS (Long Term Support)
FROM node:14

# Tạo thư mục làm việc trong hình ảnh
WORKDIR /app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc của ứng dụng
RUN npm install

# Sao chép tất cả các file và thư mục trong dự án vào hình ảnh
COPY . .

# Biên dịch ứng dụng React
RUN npm run build

# Giao diện mạng chạy ứng dụng React trên cổng 80
EXPOSE 3000

# Khởi động ứng dụng khi hình ảnh được chạy
CMD ["npm", "start"]
