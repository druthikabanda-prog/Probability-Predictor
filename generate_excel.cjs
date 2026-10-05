const XLSX = require('xlsx');
const path = require('path');

const studentData = [
  { Student_ID: 'S001', Name: 'Ravi Kumar', Marks: 72, Attendance_Pct: 84, Study_Hours_Week: 14 },
  { Student_ID: 'S002', Name: 'Priya Sharma', Marks: 85, Attendance_Pct: 92, Study_Hours_Week: 18 },
  { Student_ID: 'S003', Name: 'Anu Patel', Marks: 68, Attendance_Pct: 78, Study_Hours_Week: 11 },
  { Student_ID: 'S004', Name: 'Rahul Verma', Marks: 91, Attendance_Pct: 96, Study_Hours_Week: 22 },
  { Student_ID: 'S005', Name: 'Sneha Reddy', Marks: 77, Attendance_Pct: 88, Study_Hours_Week: 15 },
  { Student_ID: 'S006', Name: 'Vikram Singh', Marks: 64, Attendance_Pct: 74, Study_Hours_Week: 10 },
  { Student_ID: 'S007', Name: 'Ananya Gupta', Marks: 89, Attendance_Pct: 94, Study_Hours_Week: 20 },
  { Student_ID: 'S008', Name: 'Karan Joshi', Marks: 58, Attendance_Pct: 70, Study_Hours_Week: 8 },
  { Student_ID: 'S009', Name: 'Divya Nair', Marks: 82, Attendance_Pct: 90, Study_Hours_Week: 17 },
  { Student_ID: 'S010', Name: 'Amit Das', Marks: 76, Attendance_Pct: 86, Study_Hours_Week: 13 },
  { Student_ID: 'S011', Name: 'Pooja Iyer', Marks: 94, Attendance_Pct: 98, Study_Hours_Week: 24 },
  { Student_ID: 'S012', Name: 'Rohan Mehta', Marks: 69, Attendance_Pct: 81, Study_Hours_Week: 12 },
  { Student_ID: 'S013', Name: 'Neha Saxena', Marks: 87, Attendance_Pct: 93, Study_Hours_Week: 19 },
  { Student_ID: 'S014', Name: 'Siddharth Rao', Marks: 73, Attendance_Pct: 85, Study_Hours_Week: 14 },
  { Student_ID: 'S015', Name: 'Meera Bose', Marks: 79, Attendance_Pct: 89, Study_Hours_Week: 16 }
];

const deliveryData = [
  { Order_ID: 'ORD-1001', Distance_KM: 4.2, Prep_Time_Min: 12, Transit_Time_Min: 18, Delivery_Time_Min: 30 },
  { Order_ID: 'ORD-1002', Distance_KM: 8.5, Prep_Time_Min: 15, Transit_Time_Min: 27, Delivery_Time_Min: 42 },
  { Order_ID: 'ORD-1003', Distance_KM: 2.1, Prep_Time_Min: 10, Transit_Time_Min: 12, Delivery_Time_Min: 22 },
  { Order_ID: 'ORD-1004', Distance_KM: 12.0, Prep_Time_Min: 20, Transit_Time_Min: 35, Delivery_Time_Min: 55 },
  { Order_ID: 'ORD-1005', Distance_KM: 6.4, Prep_Time_Min: 14, Transit_Time_Min: 24, Delivery_Time_Min: 38 },
  { Order_ID: 'ORD-1006', Distance_KM: 5.0, Prep_Time_Min: 13, Transit_Time_Min: 21, Delivery_Time_Min: 34 },
  { Order_ID: 'ORD-1007', Distance_KM: 9.8, Prep_Time_Min: 18, Transit_Time_Min: 31, Delivery_Time_Min: 49 },
  { Order_ID: 'ORD-1008', Distance_KM: 3.6, Prep_Time_Min: 11, Transit_Time_Min: 16, Delivery_Time_Min: 27 },
  { Order_ID: 'ORD-1009', Distance_KM: 7.2, Prep_Time_Min: 16, Transit_Time_Min: 26, Delivery_Time_Min: 42 },
  { Order_ID: 'ORD-1010', Distance_KM: 11.5, Prep_Time_Min: 19, Transit_Time_Min: 34, Delivery_Time_Min: 53 }
];

const productData = [
  { Product_ID: 'P-501', Product_Name: 'Wireless Headphones', Price_INR: 4999, Weight_KG: 0.35, Rating: 4.6 },
  { Product_ID: 'P-502', Product_Name: 'Ergonomic Desk Chair', Price_INR: 12499, Weight_KG: 14.2, Rating: 4.4 },
  { Product_ID: 'P-503', Product_Name: 'Mechanical Keyboard', Price_INR: 5999, Weight_KG: 0.95, Rating: 4.8 },
  { Product_ID: 'P-504', Product_Name: 'Stainless Steel Flask', Price_INR: 1299, Weight_KG: 0.42, Rating: 4.3 },
  { Product_ID: 'P-505', Product_Name: '4K Ultra HD Monitor', Price_INR: 24999, Weight_KG: 6.8, Rating: 4.7 },
  { Product_ID: 'P-506', Product_Name: 'Smart Fitness Watch', Price_INR: 8999, Weight_KG: 0.18, Rating: 4.5 },
  { Product_ID: 'P-507', Product_Name: 'Noise Cancelling Earbuds', Price_INR: 6999, Weight_KG: 0.12, Rating: 4.6 }
];

const hospitalData = [
  { Patient_ID: 'PT-101', Age: 34, Waiting_Time_Min: 22, Treatment_Duration_Min: 45, Doctor_Rating: 4.8 },
  { Patient_ID: 'PT-102', Age: 58, Waiting_Time_Min: 40, Treatment_Duration_Min: 60, Doctor_Rating: 4.6 },
  { Patient_ID: 'PT-103', Age: 23, Waiting_Time_Min: 15, Treatment_Duration_Min: 30, Doctor_Rating: 4.9 },
  { Patient_ID: 'PT-104', Age: 45, Waiting_Time_Min: 35, Treatment_Duration_Min: 50, Doctor_Rating: 4.7 },
  { Patient_ID: 'PT-105', Age: 67, Waiting_Time_Min: 52, Treatment_Duration_Min: 75, Doctor_Rating: 4.5 },
  { Patient_ID: 'PT-106', Age: 29, Waiting_Time_Min: 18, Treatment_Duration_Min: 25, Doctor_Rating: 4.8 }
];

function createExcelFile(data, filename) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const filePath = path.join(__dirname, filename);
  XLSX.writeFile(workbook, filePath);
  console.log(`Successfully generated ${filename}`);
}

createExcelFile(studentData, 'student_performance.xlsx');
createExcelFile(deliveryData, 'delivery_logistics.xlsx');
createExcelFile(productData, 'product_prices.xlsx');
createExcelFile(hospitalData, 'hospital_wait_times.xlsx');
