/* Bệnh viện Đa khoa Hải Lam (mẫu y-te-11) — JS dùng chung */
(function(){
'use strict';
var D={"khoa":[{"id":"noi-tong-quat","n":"Nội Tổng quát","ic":"steth","g":"Nội khoa","loc":"Tầng 2, Khu A","d":"Điểm bắt đầu khi bạn chưa rõ nên khám khoa nào: khám, định hướng và chuyển đúng chuyên khoa.","sv":["Khám nội tổng quát","Theo dõi tăng huyết áp, rối loạn mỡ máu","Sốt, mệt mỏi kéo dài chưa rõ nguyên nhân","Tư vấn tiêm chủng người lớn"]},{"id":"tim-mach","n":"Tim mạch","ic":"pulse","g":"Nội khoa","loc":"Tầng 3, Khu A","d":"Khám và theo dõi huyết áp, nhịp tim, bệnh mạch vành; đo điện tim, siêu âm tim trong buổi khám.","sv":["Khám tim mạch","Điện tim, Holter điện tim 24 giờ","Siêu âm tim Doppler màu","Nghiệm pháp gắng sức","Theo dõi huyết áp 24 giờ"]},{"id":"noi-tiet","n":"Nội tiết – Đái tháo đường","ic":"drop","g":"Nội khoa","loc":"Tầng 3, Khu A","d":"Theo dõi đường huyết, tuyến giáp và các rối loạn chuyển hoá theo kế hoạch dài hạn.","sv":["Khám, theo dõi đái tháo đường","Bệnh lý tuyến giáp","Tư vấn dinh dưỡng cho người rối loạn chuyển hoá","Kiểm tra biến chứng định kỳ"]},{"id":"tieu-hoa","n":"Tiêu hoá – Gan mật","ic":"stomach","g":"Nội khoa","loc":"Tầng 4, Khu A","d":"Khám dạ dày, đại tràng, gan mật; nội soi tiêu hoá có hoặc không gây mê.","sv":["Khám tiêu hoá, gan mật","Nội soi dạ dày, đại tràng","Test hơi thở tìm vi khuẩn HP","Theo dõi viêm gan B, C"]},{"id":"co-xuong-khop","n":"Cơ Xương Khớp","ic":"bone","g":"Nội khoa","loc":"Tầng 4, Khu A","d":"Đau lưng, đau khớp, loãng xương: khám, chụp phim và hướng dẫn tập luyện phù hợp.","sv":["Khám cơ xương khớp","Đo mật độ xương","Tiêm khớp theo chỉ định","Hướng dẫn vận động, phục hồi"]},{"id":"ngoai-tong-quat","n":"Ngoại Tổng quát","ic":"scissors","g":"Ngoại khoa","loc":"Tầng 5, Khu B","d":"Khám, tư vấn và phẫu thuật các bệnh lý ngoại khoa thường gặp; theo dõi hậu phẫu tại khu nội trú.","sv":["Khám ngoại tổng quát","Phẫu thuật nội soi ổ bụng","Tiểu phẫu trong ngày","Chăm sóc vết thương, thay băng"]},{"id":"tai-mui-hong","n":"Tai Mũi Họng","ic":"ear","g":"Ngoại khoa","loc":"Tầng 2, Khu B","d":"Viêm mũi xoang, viêm họng, ù tai, nghe kém: khám và nội soi tai mũi họng tại phòng khám.","sv":["Khám tai mũi họng","Nội soi tai mũi họng","Đo thính lực","Lấy dị vật, rửa tai"]},{"id":"mat","n":"Mắt","ic":"eye","g":"Ngoại khoa","loc":"Tầng 2, Khu B","d":"Đo khúc xạ, khám đáy mắt, theo dõi tật khúc xạ ở trẻ và các bệnh mắt ở người lớn tuổi.","sv":["Khám mắt tổng quát","Đo khúc xạ, cấp đơn kính","Soi đáy mắt","Đo nhãn áp"]},{"id":"da-lieu","n":"Da liễu","ic":"layers","g":"Ngoại khoa","loc":"Tầng 2, Khu B","d":"Mụn, viêm da, dị ứng, nấm da: khám và hướng dẫn chăm sóc da theo từng tình trạng.","sv":["Khám da liễu","Soi da, soi nấm","Điều trị mụn theo phác đồ của bác sĩ","Tiểu phẫu da"]},{"id":"san-phu-khoa","n":"Sản Phụ khoa","ic":"female","g":"Sản – Nhi","loc":"Tầng 6, Khu B","d":"Khám phụ khoa, theo dõi thai kỳ, sinh và chăm sóc sau sinh tại khu Sản riêng.","sv":["Khám phụ khoa định kỳ","Theo dõi thai kỳ trọn gói","Siêu âm thai 2D, 4D","Sinh thường, sinh mổ","Chăm sóc mẹ và bé sau sinh"]},{"id":"nhi-khoa","n":"Nhi khoa","ic":"baby","g":"Sản – Nhi","loc":"Tầng 1, Khu B","d":"Khám bệnh, tiêm chủng và theo dõi phát triển cho trẻ từ sơ sinh đến 15 tuổi; có khám buổi tối.","sv":["Khám nhi tổng quát","Tiêm chủng","Tư vấn dinh dưỡng, theo dõi tăng trưởng","Nội trú nhi có người nhà ở cùng"]},{"id":"chan-doan-hinh-anh","n":"Chẩn đoán Hình ảnh","ic":"scan","g":"Cận lâm sàng","loc":"Tầng trệt, Khu A","d":"Siêu âm, X-quang, CT, MRI và nhũ ảnh thực hiện theo chỉ định, trả kết quả trên hồ sơ điện tử.","sv":["Siêu âm tổng quát, tim, mạch máu","X-quang kỹ thuật số","CT, MRI","Nhũ ảnh, đo mật độ xương"]}],"sym":[{"id":"dau-nguc","n":"Đau, tức ngực","g":"Ngực – tim – phổi","k":["tim-mach","noi-tong-quat"]},{"id":"hoi-hop","n":"Hồi hộp, đánh trống ngực","g":"Ngực – tim – phổi","k":["tim-mach","noi-tiet"]},{"id":"kho-tho","n":"Khó thở khi gắng sức","g":"Ngực – tim – phổi","k":["tim-mach","noi-tong-quat"]},{"id":"huyet-ap","n":"Huyết áp cao khi đo ở nhà","g":"Ngực – tim – phổi","k":["tim-mach","noi-tong-quat"]},{"id":"ho-keo-dai","n":"Ho kéo dài","g":"Ngực – tim – phổi","k":["noi-tong-quat","tai-mui-hong"]},{"id":"dau-dau","n":"Đau đầu, chóng mặt","g":"Đầu – mặt – cổ","k":["noi-tong-quat","tim-mach","tai-mui-hong"]},{"id":"dau-hong","n":"Đau họng, nghẹt mũi","g":"Đầu – mặt – cổ","k":["tai-mui-hong"]},{"id":"u-tai","n":"Ù tai, nghe kém","g":"Đầu – mặt – cổ","k":["tai-mui-hong"]},{"id":"mo-mat","n":"Nhìn mờ, mỏi mắt","g":"Đầu – mặt – cổ","k":["mat","noi-tiet"]},{"id":"buou-co","n":"Cổ to, nuốt vướng","g":"Đầu – mặt – cổ","k":["noi-tiet","tai-mui-hong"]},{"id":"dau-bung","n":"Đau bụng, đầy hơi","g":"Bụng – tiêu hoá","k":["tieu-hoa","ngoai-tong-quat"]},{"id":"o-chua","n":"Ợ chua, nóng rát","g":"Bụng – tiêu hoá","k":["tieu-hoa"]},{"id":"roi-loan-tieu-hoa","n":"Tiêu chảy, táo bón kéo dài","g":"Bụng – tiêu hoá","k":["tieu-hoa"]},{"id":"vang-da","n":"Vàng da, vàng mắt","g":"Bụng – tiêu hoá","k":["tieu-hoa"]},{"id":"dau-lung","n":"Đau lưng, đau cổ vai","g":"Cơ – xương – khớp","k":["co-xuong-khop"]},{"id":"dau-khop","n":"Đau, sưng khớp","g":"Cơ – xương – khớp","k":["co-xuong-khop"]},{"id":"te-tay-chan","n":"Tê tay chân","g":"Cơ – xương – khớp","k":["co-xuong-khop","noi-tiet"]},{"id":"noi-man","n":"Nổi mẩn, ngứa","g":"Da","k":["da-lieu"]},{"id":"mun","n":"Mụn, sạm da","g":"Da","k":["da-lieu"]},{"id":"khat-nhieu","n":"Khát nhiều, tiểu nhiều","g":"Toàn thân","k":["noi-tiet"]},{"id":"met-moi","n":"Mệt mỏi kéo dài","g":"Toàn thân","k":["noi-tong-quat","noi-tiet"]},{"id":"sut-can","n":"Sụt cân không rõ lý do","g":"Toàn thân","k":["noi-tong-quat","noi-tiet","tieu-hoa"]},{"id":"kham-thai","n":"Trễ kinh, cần khám thai","g":"Phụ nữ – thai kỳ","k":["san-phu-khoa"]},{"id":"phu-khoa","n":"Khó chịu vùng kín, rối loạn kinh nguyệt","g":"Phụ nữ – thai kỳ","k":["san-phu-khoa"]},{"id":"tre-sot","n":"Trẻ sốt, ho, sổ mũi","g":"Trẻ em","k":["nhi-khoa"]},{"id":"tre-bieng-an","n":"Trẻ biếng ăn, chậm tăng cân","g":"Trẻ em","k":["nhi-khoa"]},{"id":"tiem-chung","n":"Tiêm chủng cho trẻ","g":"Trẻ em","k":["nhi-khoa"]},{"id":"cc-nguc","n":"Đau ngực dữ dội, vã mồ hôi","g":"Dấu hiệu cần cấp cứu","k":[],"red":1},{"id":"cc-dot-quy","n":"Méo miệng, yếu liệt nửa người, nói khó","g":"Dấu hiệu cần cấp cứu","k":[],"red":1},{"id":"cc-kho-tho","n":"Khó thở dữ dội, tím tái","g":"Dấu hiệu cần cấp cứu","k":[],"red":1},{"id":"cc-co-giat","n":"Co giật, bất tỉnh","g":"Dấu hiệu cần cấp cứu","k":[],"red":1}],"dr":[{"id":"le-hoang-minh-thu","t":"TS.BS","n":"Lê Hoàng Minh Thư","sex":"nu","k":"tim-mach","y":18,"days":{"1":"SC","3":"SC","5":"S","6":"S"},"focus":["Tăng huyết áp","Bệnh mạch vành","Siêu âm tim","Tim mạch ở phụ nữ"],"bio":"Bác sĩ Minh Thư theo dõi người bệnh tăng huyết áp và bệnh mạch vành theo kế hoạch dài hạn. Trong buổi khám, bác sĩ dành thời gian giải thích từng chỉ số để người bệnh tự theo dõi được ở nhà.","edu":[["2002–2008","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2010–2012","Thạc sĩ Y học, chuyên ngành Nội Tim mạch"],["2015–2019","Tiến sĩ Y học, chuyên ngành Nội Tim mạch"],["2021","Khoá đào tạo siêu âm tim nâng cao (ngắn hạn, tại Singapore)"]],"lang":"Tiếng Việt, Tiếng Anh","img":"https://images.unsplash.com/photo-1686737357914-80a665ca1c29?auto=format&fit=crop&w=480&q=75","fee":450000},{"id":"pham-quoc-bao","t":"BS.CKII","n":"Phạm Quốc Bảo","sex":"nam","k":"tim-mach","y":22,"days":{"2":"SC","4":"SC","6":"SC"},"focus":["Rối loạn nhịp tim","Suy tim","Holter điện tim"],"bio":"Bác sĩ Quốc Bảo có nhiều năm làm việc tại khoa Nội Tim mạch, quan tâm tới rối loạn nhịp và suy tim ở người lớn tuổi.","edu":[["1998–2004","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2008–2010","Chuyên khoa cấp I Nội Tim mạch"],["2014–2016","Chuyên khoa cấp II Nội Tim mạch"]],"lang":"Tiếng Việt, Tiếng Anh","img":"https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=480&q=75","fee":450000},{"id":"do-gia-huy","t":"ThS.BS","n":"Đỗ Gia Huy","sex":"nam","k":"tim-mach","y":9,"days":{"1":"T","2":"T","3":"T","5":"CT","7":"S"},"focus":["Tầm soát yếu tố nguy cơ tim mạch","Rối loạn mỡ máu","Nghiệm pháp gắng sức"],"bio":"Bác sĩ Gia Huy phụ trách các buổi khám tối và sáng Chủ nhật, phù hợp với người đi làm giờ hành chính.","edu":[["2010–2016","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2018–2020","Thạc sĩ Y học, chuyên ngành Nội khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"nguyen-thanh-van","t":"BS.CKI","n":"Nguyễn Thị Thanh Vân","sex":"nu","k":"noi-tong-quat","y":15,"days":{"1":"SC","2":"SC","4":"SC","6":"S"},"focus":["Khám nội tổng quát","Bệnh mạn tính ở người lớn tuổi","Tư vấn tiêm chủng người lớn"],"bio":"Bác sĩ Thanh Vân thường là người đầu tiên tiếp nhận khi người bệnh chưa rõ nên khám chuyên khoa nào.","edu":[["2004–2010","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2013–2015","Chuyên khoa cấp I Nội khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"tran-duc-long","t":"ThS.BS","n":"Trần Đức Long","sex":"nam","k":"noi-tong-quat","y":11,"days":{"3":"SC","5":"SC","6":"C","7":"S"},"focus":["Khám sức khoẻ tổng quát","Đọc và tư vấn kết quả","Bệnh hô hấp thường gặp"],"bio":"Bác sĩ Đức Long phụ trách tư vấn kết quả tại Trung tâm Khám sức khoẻ tổng quát.","edu":[["2008–2014","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2016–2018","Thạc sĩ Y học, chuyên ngành Nội khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"vo-ngoc-diep","t":"BS.CKII","n":"Võ Thị Ngọc Diệp","sex":"nu","k":"san-phu-khoa","y":24,"days":{"1":"SC","3":"SC","4":"S","6":"S"},"focus":["Theo dõi thai kỳ nguy cơ","Sinh mổ","Khám phụ khoa"],"bio":"Bác sĩ Ngọc Diệp theo dõi thai kỳ từ những tuần đầu đến sau sinh, ưu tiên trao đổi rõ ràng để gia đình chủ động chuẩn bị.","edu":[["1996–2002","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2005–2007","Chuyên khoa cấp I Sản Phụ khoa"],["2012–2014","Chuyên khoa cấp II Sản Phụ khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":450000},{"id":"huynh-mai-phuong","t":"ThS.BS","n":"Huỳnh Mai Phương","sex":"nu","k":"san-phu-khoa","y":10,"days":{"2":"SC","4":"CT","5":"SC","7":"S"},"focus":["Siêu âm thai","Khám tiền sản","Tư vấn sau sinh"],"bio":"Bác sĩ Mai Phương thực hiện siêu âm thai và khám tiền sản, có lịch khám tối thứ Năm.","edu":[["2009–2015","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2017–2019","Thạc sĩ Y học, chuyên ngành Sản Phụ khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"dang-minh-khoi","t":"BS.CKI","n":"Đặng Minh Khôi","sex":"nam","k":"nhi-khoa","y":14,"days":{"1":"SC","2":"CT","4":"SC","6":"SC"},"focus":["Bệnh hô hấp ở trẻ","Tiêm chủng","Dị ứng ở trẻ nhỏ"],"bio":"Bác sĩ Minh Khôi khám nhi tổng quát, quen làm việc với trẻ nhỏ sợ áo trắng: khám chậm, giải thích kỹ cho ba mẹ.","edu":[["2005–2011","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2014–2016","Chuyên khoa cấp I Nhi khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"ly-thu-trang","t":"ThS.BS","n":"Lý Thu Trang","sex":"nu","k":"nhi-khoa","y":8,"days":{"2":"S","3":"CT","5":"CT","6":"S","7":"SC"},"focus":["Dinh dưỡng, tăng trưởng","Sơ sinh","Tiêu hoá ở trẻ"],"bio":"Bác sĩ Thu Trang theo dõi dinh dưỡng và tăng trưởng, khám buổi tối và cả ngày Chủ nhật.","edu":[["2011–2017","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2019–2021","Thạc sĩ Y học, chuyên ngành Nhi khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"bui-anh-tuan","t":"TS.BS","n":"Bùi Anh Tuấn","sex":"nam","k":"tieu-hoa","y":20,"days":{"1":"S","2":"SC","4":"S","5":"SC"},"focus":["Nội soi tiêu hoá","Trào ngược dạ dày","Viêm gan mạn"],"bio":"Bác sĩ Anh Tuấn thực hiện nội soi dạ dày, đại tràng và theo dõi các bệnh gan mạn tính.","edu":[["2000–2006","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2008–2010","Thạc sĩ Y học, chuyên ngành Nội Tiêu hoá"],["2013–2017","Tiến sĩ Y học, chuyên ngành Nội Tiêu hoá"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":450000},{"id":"ho-van-thanh","t":"BS.CKII","n":"Hồ Văn Thành","sex":"nam","k":"co-xuong-khop","y":21,"days":{"1":"C","3":"SC","5":"S","6":"SC"},"focus":["Thoái hoá khớp","Loãng xương","Đau cột sống"],"bio":"Bác sĩ Văn Thành khám các bệnh cơ xương khớp ở người trung niên và lớn tuổi, chú trọng hướng dẫn vận động.","edu":[["1999–2005","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2008–2010","Chuyên khoa cấp I Nội Cơ Xương Khớp"],["2015–2017","Chuyên khoa cấp II Nội Cơ Xương Khớp"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":450000},{"id":"phan-hong-nhung","t":"BS.CKI","n":"Phan Thị Hồng Nhung","sex":"nu","k":"tai-mui-hong","y":12,"days":{"2":"SC","3":"S","5":"SC","7":"S"},"focus":["Viêm mũi xoang","Nội soi tai mũi họng","Tai mũi họng trẻ em"],"bio":"Bác sĩ Hồng Nhung khám tai mũi họng cho cả người lớn và trẻ em, thực hiện nội soi ngay tại phòng khám.","edu":[["2007–2013","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2016–2018","Chuyên khoa cấp I Tai Mũi Họng"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"duong-khanh-linh","t":"ThS.BS","n":"Dương Khánh Linh","sex":"nu","k":"mat","y":9,"days":{"1":"SC","4":"SC","6":"SC"},"focus":["Tật khúc xạ","Khô mắt","Mắt trẻ em"],"bio":"Bác sĩ Khánh Linh đo khúc xạ, khám mắt cho học sinh và người làm việc nhiều với màn hình.","edu":[["2010–2016","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2018–2020","Thạc sĩ Y học, chuyên ngành Nhãn khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"trinh-bao-ngoc","t":"BS.CKI","n":"Trịnh Bảo Ngọc","sex":"nu","k":"da-lieu","y":10,"days":{"2":"CT","3":"SC","5":"CT","6":"S"},"focus":["Mụn trứng cá","Viêm da cơ địa","Dị ứng da"],"bio":"Bác sĩ Bảo Ngọc khám da liễu, hướng dẫn chăm sóc da đơn giản, hạn chế dùng nhiều sản phẩm cùng lúc.","edu":[["2009–2015","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2018–2020","Chuyên khoa cấp I Da liễu"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"vu-hai-dang","t":"ThS.BS","n":"Vũ Hải Đăng","sex":"nam","k":"noi-tiet","y":13,"days":{"1":"SC","3":"C","4":"SC","6":"S"},"focus":["Đái tháo đường","Bệnh tuyến giáp","Rối loạn chuyển hoá"],"bio":"Bác sĩ Hải Đăng theo dõi người bệnh đái tháo đường và tuyến giáp, phối hợp với chuyên viên dinh dưỡng.","edu":[["2006–2012","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2014–2016","Thạc sĩ Y học, chuyên ngành Nội tiết"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000},{"id":"ta-quang-vinh","t":"BS.CKII","n":"Tạ Quang Vinh","sex":"nam","k":"ngoai-tong-quat","y":23,"days":{"2":"S","3":"SC","5":"S"},"focus":["Phẫu thuật nội soi ổ bụng","Thoát vị","Sỏi túi mật"],"bio":"Bác sĩ Quang Vinh khám và phẫu thuật các bệnh lý ngoại tổng quát, trực tiếp theo dõi người bệnh sau mổ.","edu":[["1997–2003","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2006–2008","Chuyên khoa cấp I Ngoại khoa"],["2013–2015","Chuyên khoa cấp II Ngoại khoa"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":450000},{"id":"chau-minh-tri","t":"BS.CKI","n":"Châu Minh Trí","sex":"nam","k":"chan-doan-hinh-anh","y":16,"days":{"1":"SC","2":"SC","4":"SC","5":"SC"},"focus":["CT, MRI","X-quang","Hình ảnh tim mạch"],"bio":"Bác sĩ Minh Trí đọc kết quả CT, MRI và trao đổi trực tiếp với bác sĩ chuyên khoa khi cần hội chẩn.","edu":[["2003–2009","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2012–2014","Chuyên khoa cấp I Chẩn đoán Hình ảnh"]],"lang":"Tiếng Việt, Tiếng Anh","img":"https://images.unsplash.com/photo-1581595219315-a187dd40c322?auto=format&fit=crop&w=480&q=75","fee":250000},{"id":"lam-thuy-an","t":"BS.CKI","n":"Lâm Thuý An","sex":"nu","k":"chan-doan-hinh-anh","y":11,"days":{"2":"SC","3":"SC","6":"SC","7":"S"},"focus":["Siêu âm tổng quát","Siêu âm tuyến vú, tuyến giáp","Nhũ ảnh"],"bio":"Bác sĩ Thuý An thực hiện siêu âm tổng quát, siêu âm tuyến vú và tuyến giáp.","edu":[["2008–2014","Bác sĩ Đa khoa, hệ chính quy 6 năm"],["2017–2019","Chuyên khoa cấp I Chẩn đoán Hình ảnh"]],"lang":"Tiếng Việt, Tiếng Anh","img":"","fee":250000}],"pkg":[{"id":"co-ban","n":"Cơ Bản","price":[1900000,2200000],"age":"18–29 tuổi","t":"Khoảng 2 giờ","d":"Kiểm tra các chỉ số nền tảng mỗi năm cho người trẻ, chưa có bệnh nền."},{"id":"nang-cao","n":"Nâng Cao","price":[3600000,4100000],"age":"30–44 tuổi","t":"Khoảng 3 giờ","d":"Thêm tuyến giáp, viêm gan và siêu âm tim cho người bắt đầu có yếu tố nguy cơ."},{"id":"chuyen-sau","n":"Chuyên Sâu","price":[6800000,7500000],"age":"45–59 tuổi","t":"Khoảng 4 giờ","d":"Mở rộng tim mạch, tiêu hoá và mật độ xương cho tuổi trung niên."},{"id":"toan-dien","n":"Toàn Diện","price":[11500000,12900000],"age":"Từ 60 tuổi","t":"Trong buổi sáng","d":"Đầy đủ hạng mục, có nội soi gây mê và CT ngực liều thấp theo chỉ định."}],"price":[["Khám bệnh","Khám chuyên khoa trong giờ hành chính",250000,"Thứ 2 – Thứ 7, 07:00–16:30"],["Khám bệnh","Khám buổi tối, Chủ nhật",350000,"17:00–20:00 và sáng Chủ nhật"],["Khám bệnh","Khám chọn bác sĩ CKII, Tiến sĩ",450000,"Theo lịch của từng bác sĩ"],["Khám bệnh","Tái khám trong 7 ngày",150000,"Cùng chuyên khoa, cùng đợt khám"],["Khám bệnh","Khám tại khoa Cấp cứu",400000,"Chưa gồm thủ thuật, thuốc"],["Xét nghiệm","Công thức máu",120000,""],["Xét nghiệm","Đường huyết lúc đói",50000,"Nhịn ăn 8 giờ"],["Xét nghiệm","HbA1c",180000,"Không cần nhịn ăn"],["Xét nghiệm","Bộ mỡ máu (4 chỉ số)",220000,"Nhịn ăn 8–10 giờ"],["Xét nghiệm","Chức năng gan (AST, ALT, GGT)",150000,""],["Xét nghiệm","Tổng phân tích nước tiểu",70000,""],["Chẩn đoán hình ảnh","X-quang ngực thẳng",150000,""],["Chẩn đoán hình ảnh","Siêu âm bụng tổng quát",250000,"Nhịn ăn 6 giờ"],["Chẩn đoán hình ảnh","Siêu âm tim Doppler màu",450000,""],["Chẩn đoán hình ảnh","Điện tim",100000,""],["Chẩn đoán hình ảnh","Holter điện tim 24 giờ",900000,"Trả máy vào ngày hôm sau"],["Chẩn đoán hình ảnh","CT một vùng, không thuốc cản quang",1800000,""],["Chẩn đoán hình ảnh","MRI một vùng",2900000,"Báo trước nếu có thiết bị kim loại trong người"],["Chẩn đoán hình ảnh","Nhũ ảnh hai bên",650000,""],["Nội soi – thủ thuật","Nội soi dạ dày không gây mê",900000,"Nhịn ăn 6–8 giờ"],["Nội soi – thủ thuật","Nội soi dạ dày gây mê",1900000,"Cần có người thân đi cùng"],["Nội soi – thủ thuật","Nội soi đại tràng gây mê",2800000,"Chuẩn bị ruột theo hướng dẫn"],["Nội trú","Phòng 2 giường (mỗi ngày)",1200000,"Chưa gồm thuốc, vật tư"],["Nội trú","Phòng đơn (mỗi ngày)",2400000,"Có giường cho người nhà"],["Sản","Gói theo dõi thai kỳ từ 12 tuần",14500000,"Gồm khám, siêu âm, xét nghiệm theo mốc"],["Sản","Gói sinh thường (3 ngày nội trú)",28000000,"Phòng đơn, chăm sóc mẹ và bé"],["Sản","Gói sinh mổ (4 ngày nội trú)",42000000,"Phòng đơn, chăm sóc mẹ và bé"]],"art":[{"id":"do-huyet-ap-tai-nha","k":"Tim mạch","t":"Đo huyết áp tại nhà: đo sao cho đúng, khi nào nên đi khám","s":"Cách chuẩn bị, tư thế đo, cách ghi nhật ký và những con số nên trao đổi với bác sĩ."},{"id":"tre-sot","k":"Nhi khoa","t":"Trẻ sốt: theo dõi tại nhà và những dấu hiệu cần đưa đi khám","s":"Sốt là phản ứng thường gặp ở trẻ. Điều quan trọng là quan sát cách trẻ chơi, bú, ngủ và nhận ra những dấu hiệu cần gặp bác sĩ sớm."},{"id":"chuan-bi-kham-tong-quat","k":"Khám tổng quát","t":"Khám sức khoẻ tổng quát: nhịn ăn bao lâu, cần chuẩn bị gì","s":"Một buổi khám tổng quát suôn sẻ bắt đầu từ tối hôm trước: nhịn ăn đúng giờ, ngủ đủ và mang theo kết quả cũ."},{"id":"lich-kham-thai","k":"Sản Phụ khoa","t":"Lịch khám thai theo từng mốc tuần: mỗi lần khám để làm gì","s":"Mỗi mốc khám thai có một mục đích riêng. Biết trước giúp ba mẹ sắp xếp công việc và không bỏ lỡ thời điểm quan trọng."},{"id":"trao-nguoc","k":"Tiêu hoá","t":"Trào ngược dạ dày: những thói quen nên điều chỉnh trước","s":"Ợ chua, nóng rát sau xương ức hay gặp ở người ăn muộn, ăn nhanh. Thay đổi thói quen thường là bước đầu bác sĩ khuyên."},{"id":"dau-lung","k":"Cơ Xương Khớp","t":"Đau lưng ở người ngồi nhiều: khi nào cần đi khám","s":"Phần lớn đau lưng do tư thế sẽ dịu đi khi thay đổi cách ngồi và vận động. Một số dấu hiệu thì nên khám sớm."},{"id":"doc-ket-qua-mo-mau","k":"Nội tiết","t":"Đọc kết quả mỡ máu: bốn chỉ số nói lên điều gì","s":"Cholesterol toàn phần, LDL, HDL và triglycerid cho bác sĩ một phần bức tranh về nguy cơ tim mạch của bạn."},{"id":"mri-va-ct","k":"Chẩn đoán hình ảnh","t":"MRI và CT khác nhau thế nào, khi nào dùng loại nào","s":"Cả hai đều cho hình ảnh cắt lớp, nhưng nguyên lý, thời gian chụp và thế mạnh khác nhau."}]};
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var root=document.documentElement,body=document.body,page=body.getAttribute('data-page');
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var STATIC=root.classList.contains('static');
var hasIO='IntersectionObserver' in window;
var P=page==='home'?'':'../';
var KEY='y-te-11:';
function lsGet(k,d){try{var v=localStorage.getItem(KEY+k);return v?JSON.parse(v):d}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}
function money(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,'.')+'đ'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
function ic(n){return '<svg class="ic" aria-hidden="true"><use href="#i-'+n+'"/></svg>'}
function pad(n){return (n<10?'0':'')+n}
function fmtD(d){return pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear()}
var DOW=['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7'];
function isoDow(d){var x=d.getDay();return x===0?7:x}
var SES={S:'Sáng',C:'Chiều',T:'Tối'};
var SLOTS={S:['07:30','08:00','08:30','09:00','09:30','10:00','10:30','11:00'],C:['13:30','14:00','14:30','15:00','15:30','16:00'],T:['17:00','17:30','18:00','18:30','19:00','19:30']};
var khoaBy={},drBy={};D.khoa.forEach(function(k){khoaBy[k.id]=k});D.dr.forEach(function(d){drBy[d.id]=d});
function drName(d){return d.t+' '+d.n}
function initials(n){var w=n.split(' ');return (w[w.length-2][0]+w[w.length-1][0]).toUpperCase()}
function avatar(d,cls){cls='av'+(cls?' '+cls:'');if(d.img)return '<img class="'+cls+'" src="'+d.img+'" alt="Chân dung '+esc(drName(d))+'" width="240" height="240" loading="lazy">';return '<span class="'+cls+' '+(d.sex==='nu'?'nu':'av-mono')+'" aria-hidden="true">'+initials(d.n)+'</span>'}
var toastT;function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},2600)}
/* lịch khám của bác sĩ trong một ngày: mảng khung giờ; khung đã kín giả lập ổn định theo ngày */
function slotsFor(d,date){var s=d.days[isoDow(date)]||'';var out=[],now=new Date(),isT=date.toDateString()===now.toDateString(),nm=now.getHours()*60+now.getMinutes()+60;s.split('').forEach(function(x){(SLOTS[x]||[]).forEach(function(t,i){var h=(date.getDate()*7+i*13+d.id.length*3+x.charCodeAt(0))%9,m=+t.slice(0,2)*60+(+t.slice(3));out.push({t:t,s:x,full:h<2||(isT&&m<nm)})})});return out}
var TODAY=new Date();TODAY.setHours(0,0,0,0);
function nextDays(n){var a=[];for(var i=0;i<n;i++){var d=new Date(TODAY);d.setDate(d.getDate()+i);a.push(d)}return a}
window.HL={D:D,$:$,$$:$$,lsGet:lsGet,lsSet:lsSet,money:money,esc:esc,norm:norm,ic:ic,fmtD:fmtD,DOW:DOW,isoDow:isoDow,SES:SES,slotsFor:slotsFor,nextDays:nextDays,TODAY:TODAY,khoaBy:khoaBy,drBy:drBy,drName:drName,avatar:avatar,toast:toast,P:P,page:page,RM:RM,STATIC:STATIC,pad:pad};

/* hiệu ứng: chỉ bật khi có IO, không giảm chuyển động, không phải headless */
if(hasIO&&!RM&&!STATIC){root.classList.add('anim');
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.06});
  HL.reveal=function(els){els.forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in');else ro.observe(el)})};
  HL.reveal($$('.rv'));
}else{HL.reveal=function(els){els.forEach(function(el){el.classList.add('in')})};HL.reveal($$('.rv'))}

/* header, nút lên đầu, badge */
var hdr=$('#hdr'),badge=$('#ktBadge'),top=$('#toTop');
function onScroll(){var y=window.pageYOffset;if(hdr)hdr.classList.toggle('scrolled',y>8);if(badge)badge.classList.toggle('show',y>innerHeight*.85);if(top)top.classList.toggle('show',y>innerHeight*1.2)}
addEventListener('scroll',onScroll,{passive:true});onScroll();
if(top)top.addEventListener('click',function(){scrollTo({top:0,behavior:RM?'auto':'smooth'});var s=$('.skip');});

/* khoá cuộn */
function lock(on){body.classList.toggle('lock',on);root.style.overflow=on?'hidden':''}
HL.lock=lock;

/* menu mobile */
var mnav=$('#mnav'),mb=$('#menuBtn'),mc=$('#menuClose');
function menu(open){mnav.classList.toggle('open',open);mnav.setAttribute('aria-hidden',open?'false':'true');mb.setAttribute('aria-expanded',open);lock(open);if(open)mc.focus();else mb.focus()}
if(mnav&&mb){mb.addEventListener('click',function(){menu(true)});mc.addEventListener('click',function(){menu(false)});
  $$('#mnav a').forEach(function(a){a.addEventListener('click',function(){mnav.classList.remove('open');mb.setAttribute('aria-expanded','false');lock(false)})});}

/* tìm kiếm trong site */
var srch=$('#srch'),sIn=$('#srchIn'),sRes=$('#srchRes'),sBtn=$('#searchBtn'),lastFocus;
var IDX=[];
D.khoa.forEach(function(k){IDX.push({g:'Chuyên khoa',t:k.n,s:k.d+' '+k.sv.join(' '),u:(k.id==='tim-mach'?P+'khoa-tim-mach/':P+'chuyen-khoa/#k-'+k.id),i:k.ic,sub:k.loc})});
D.sym.forEach(function(s){if(!s.red)IDX.push({g:'Triệu chứng',t:s.n,s:s.g,u:P+'chuyen-khoa/?tc='+s.id+'#tim-trieu-chung',i:'search',sub:'Gợi ý: '+s.k.map(function(k){return khoaBy[k].n}).join(', ')})});
D.dr.forEach(function(d){IDX.push({g:'Bác sĩ',t:drName(d),s:khoaBy[d.k].n+' '+d.focus.join(' '),u:P+'ho-so-bac-si/?id='+d.id,i:'user',sub:khoaBy[d.k].n})});
D.pkg.forEach(function(p){IDX.push({g:'Gói khám',t:'Gói khám '+p.n,s:p.d+' '+p.age+' khám sức khoẻ tổng quát',u:P+'goi-kham/#g-'+p.id,i:'shield',sub:p.age+' · từ '+money(p.price[0])})});
D.price.forEach(function(p){IDX.push({g:'Bảng giá',t:p[1],s:p[0]+' '+p[3]+' giá',u:P+'huong-dan/?q='+encodeURIComponent(p[1])+'#bang-gia',i:'wallet',sub:money(p[2])+(p[3]?' · '+p[3]:'')})});
D.art.forEach(function(a){IDX.push({g:'Bài viết',t:a.t,s:a.k+' '+a.s,u:P+'kien-thuc/#'+(a.id==='do-huyet-ap-tai-nha'?a.id:'bai-'+a.id),i:'book',sub:a.k})});
[['Giờ thăm bệnh','huong-dan/#tham-benh','clock','Khu nội trú, khu Sản, Hồi sức'],['Bảo hiểm y tế, bảo hiểm tư nhân','huong-dan/#bao-hiem','shield','Bảo lãnh viện phí, hồ sơ cần mang'],['Quy trình nhập viện','huong-dan/#nhap-vien','bed','Thủ tục, giấy tờ, đồ dùng'],['Câu hỏi thường gặp','huong-dan/#hoi-dap','info','Hỏi đáp về khám, thanh toán, kết quả'],['Cấp cứu 24/7, số 115','lien-he/#cap-cuu','ambulance','Gọi 115 hoặc 0900 000 115'],['Bản đồ, bãi gửi xe','lien-he/#ban-do','pin','Lối vào Cổng A, Cổng B'],['Đặt lịch khám','dat-lich/','calendar','Chọn khoa, bác sĩ, ngày giờ'],['Tính giá khám doanh nghiệp','goi-kham/#doanh-nghiep','building','Ước tính theo số nhân viên']].forEach(function(x){IDX.push({g:'Trang',t:x[0],s:x[3],u:P+x[1],i:x[2],sub:x[3]})});
IDX.forEach(function(x){x.n=norm(x.t+' '+x.s+' '+x.g)});
function hl(t,q){var nt=norm(t),i=nt.indexOf(q);if(i<0||!q)return esc(t);return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}
function doSearch(){var q=norm(sIn.value.trim());$('#srchHint').hidden=!!q;if(!q){sRes.innerHTML='';return}
  var ws=q.split(/\s+/),r=IDX.filter(function(x){return ws.every(function(w){return x.n.indexOf(w)>-1})});
  r.sort(function(a,b){return (norm(a.t).indexOf(q)>-1?0:1)-(norm(b.t).indexOf(q)>-1?0:1)});
  if(!r.length){sRes.innerHTML='<p class="srch-empty">Không tìm thấy kết quả cho “'+esc(sIn.value)+'”. Hãy thử từ khác, hoặc gọi tổng đài <a href="tel:0900000000">0900&nbsp;000&nbsp;000</a>.</p>';return}
  var g={},h='';r.slice(0,24).forEach(function(x){(g[x.g]=g[x.g]||[]).push(x)});
  Object.keys(g).forEach(function(k){h+='<p class="srch-g">'+k+'</p>';g[k].slice(0,6).forEach(function(x){h+='<a href="'+x.u+'">'+ic(x.i)+'<span><b>'+hl(x.t,q)+'</b><small>'+esc(x.sub||'')+'</small></span></a>'})});
  sRes.innerHTML=h}
function openS(){lastFocus=document.activeElement;srch.hidden=false;lock(true);setTimeout(function(){sIn.focus()},20)}
function closeS(){srch.hidden=true;lock(false);if(lastFocus)lastFocus.focus()}
HL.openSearch=openS;
var ms=$('#mSearch');if(ms)ms.addEventListener('click',function(){mnav.classList.remove('open');mnav.setAttribute('aria-hidden','true');mb.setAttribute('aria-expanded','false');lastFocus=mb;srch.hidden=false;lock(true);setTimeout(function(){sIn.focus()},20)});
if(srch){sBtn.addEventListener('click',openS);$('#srchClose').addEventListener('click',closeS);
  srch.addEventListener('click',function(e){if(e.target===srch)closeS()});
  sIn.addEventListener('input',doSearch);
  $$('#srchHint button').forEach(function(b){b.addEventListener('click',function(){sIn.value=b.getAttribute('data-q');doSearch();sIn.focus()})});
  srch.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(a){srch.hidden=true;lock(false)}});
  srch.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=$$('input,button,a',srch).filter(function(x){return x.offsetParent!==null});if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}});
}
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(srch&&!srch.hidden)closeS();else if(mnav&&mnav.classList.contains('open'))menu(false)}
  if(e.key==='/'&&srch&&srch.hidden&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();openS()}
});

/* trạng thái mở cửa trên thanh trên cùng */
(function(){var el=$('#tbState');if(!el)return;var n=new Date(),d=n.getDay(),m=n.getHours()*60+n.getMinutes();var open=d===0?(m>=420&&m<720):(m>=420&&m<1200);
  el.innerHTML='<span class="tb-open'+(open?'':' closed')+'"><i></i>'+(open?'Đang mở cửa khám bệnh':'Ngoài giờ khám · Cấp cứu vẫn trực')+'</span> · '+(d===0?'Chủ nhật 07:00–12:00':'Hôm nay 07:00–20:00')})();

/* accordion */
$$('.acc-btn').forEach(function(b){b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o)})});

/* yêu thích bác sĩ (dùng chung mọi trang) */
function favs(){return lsGet('fav',[])}
function paintFav(){var f=favs();$$('[data-fav]').forEach(function(b){var on=f.indexOf(b.getAttribute('data-fav'))>-1;b.setAttribute('aria-pressed',on)});$$('[data-fav-count]').forEach(function(x){x.textContent=f.length})}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-fav]');if(!b)return;e.preventDefault();var id=b.getAttribute('data-fav'),f=favs(),i=f.indexOf(id);if(i>-1){f.splice(i,1);toast('Đã bỏ khỏi danh sách bác sĩ đã lưu')}else{f.push(id);toast('Đã lưu bác sĩ. Xem lại ở trang Bác sĩ.')}lsSet('fav',f);paintFav();if(HL.onFav)HL.onFav()});
HL.favs=favs;HL.paintFav=paintFav;paintFav();

/* kiểm tra form đơn giản: data-req, data-type=phone|email */
HL.validate=function(scope){var ok=true,first=null;$$('[data-req]',scope).forEach(function(inp){var f=inp.closest('.fld,.agree'),v=(inp.type==='checkbox')?inp.checked:inp.value.trim(),bad=!v;
  if(!bad&&inp.getAttribute('data-type')==='phone')bad=!/^0\d{9}$/.test(inp.value.replace(/[\s.]/g,''));
  if(!bad&&inp.getAttribute('data-type')==='email'&&inp.value.trim())bad=!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
  if(!bad&&inp.getAttribute('data-type')==='year'){var y=+inp.value;bad=!(y>=1920&&y<=TODAY.getFullYear())}
  if(f)f.classList.toggle('err',bad);inp.setAttribute('aria-invalid',bad?'true':'false');if(bad){ok=false;if(!first)first=inp}});
  if(first)first.focus();return ok};
document.addEventListener('input',function(e){var f=e.target.closest&&e.target.closest('.fld.err,.agree.err');if(f){f.classList.remove('err');e.target.setAttribute('aria-invalid','false')}});
document.addEventListener('change',function(e){var f=e.target.closest&&e.target.closest('.agree.err');if(f&&e.target.checked)f.classList.remove('err')});
HL.code=function(pre){var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return pre+'-'+s.slice(0,3)+s.slice(3)};

/* form đơn (liên hệ, tư vấn...) */
$$('form[data-simple]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();if(!HL.validate(f))return;var d=$('#'+f.getAttribute('data-simple'));f.hidden=true;if(d){d.hidden=false;var c=$('.code',d);if(c)c.textContent=HL.code(f.getAttribute('data-pre')||'HL');d.setAttribute('tabindex','-1');d.focus()}})});
$$('[data-reset]').forEach(function(b){b.addEventListener('click',function(){var f=$('#'+b.getAttribute('data-reset'));var d=b.closest('.done');if(d)d.hidden=true;if(f){f.reset();f.hidden=false}})});
})();

/* trang chủ */
(function(){var H=window.HL;if(H.page!=='home')return;var $=H.$,$$=H.$$;
/* đặt lịch nhanh */
var qK=$('#qbK'),qD=$('#qbD'),qN=$('#qbN');
function fillDr(){var k=qK.value,h='<option value="">Bác sĩ nào cũng được</option>';H.D.dr.forEach(function(d){if(!k||d.k===k)h+='<option value="'+d.id+'">'+H.esc(H.drName(d))+(k?'':' · '+H.khoaBy[d.k].n)+'</option>'});qD.innerHTML=h;fillDays()}
function fillDays(){var d=H.drBy[qD.value],h='<option value="">Ngày gần nhất còn lịch</option>';H.nextDays(14).forEach(function(x){var w=H.isoDow(x);if(d&&!d.days[w])return;if(!d&&w===7&&false)return;h+='<option value="'+H.fmtD(x)+'">'+H.DOW[x.getDay()]+', '+H.fmtD(x)+'</option>'});qN.innerHTML=h}
qK.addEventListener('change',fillDr);qD.addEventListener('change',fillDays);fillDr();
$('#qb').addEventListener('submit',function(e){e.preventDefault();var dv=qD.value||(qK.value?'any':null),kv=qK.value||(qD.value?H.drBy[qD.value].k:'');H.lsSet('booking',{k:kv,d:dv,date:qN.value||null,step:kv?3:1});location.href=H.P+'dat-lich/'});
/* số bác sĩ khám hôm nay */
var w=H.isoDow(H.TODAY),n=H.D.dr.filter(function(d){return d.days[w]}).length;$('#hcTodayN').textContent=n+' bác sĩ khám hôm nay';$('#hcToday').href=H.P+'bac-si/?ngay='+w;
/* tab chuyên khoa */
var tabs=$$('#kxTabs [role=tab]'),img=$('#kxImg');
function sel(b,focus){tabs.forEach(function(t){var on=t===b;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});var k=H.khoaBy[b.getAttribute('data-k')];
  img.style.opacity=0;setTimeout(function(){img.src=b.getAttribute('data-img');img.alt=b.getAttribute('data-alt');img.style.opacity=1},H.RM?0:180);
  $('#kxName').textContent=k.n;$('#kxDesc').textContent=k.d;$('#kxLoc').textContent=k.loc;$('#kxSv').innerHTML=k.sv.slice(0,4).map(function(s){return '<li>'+H.esc(s)+'</li>'}).join('');
  var m=$('#kxMore');m.href=k.id==='tim-mach'?H.P+'khoa-tim-mach/':H.P+'chuyen-khoa/#k-'+k.id;m.querySelector('span').textContent=k.id==='tim-mach'?'Xem khoa Tim mạch':'Xem chi tiết khoa';
  $('#kxDr').href=H.P+'bac-si/?khoa='+k.id;if(focus)b.focus()}
tabs.forEach(function(b,i){b.addEventListener('click',function(){sel(b)});b.addEventListener('keydown',function(e){var j=e.key==='ArrowDown'||e.key==='ArrowRight'?i+1:e.key==='ArrowUp'||e.key==='ArrowLeft'?i-1:null;if(j===null)return;e.preventDefault();sel(tabs[(j+tabs.length)%tabs.length],true)})});
tabs.forEach(function(t,i){t.tabIndex=i?-1:0});
/* sơ đồ tầng */
var FL={'0':['Tầng trệt','Sảnh chính, lối vào Cổng A',[['Khu A','Tiếp đón, Chẩn đoán Hình ảnh, Nhà thuốc'],['Khu B','Cấp cứu 24/7 (lối vào Cổng B), Xét nghiệm']]],'1':['Tầng 1','Thủ tục, thanh toán',[['Khu A','Quầy bảo hiểm, thu ngân, trả kết quả'],['Khu B','Nhi khoa, tiêm chủng, phòng chơi cho trẻ']]],'2':['Tầng 2','Khám ngoại trú',[['Khu A','Nội Tổng quát'],['Khu B','Tai Mũi Họng, Mắt, Da liễu']]],'3':['Tầng 3','Khám ngoại trú',[['Khu A','Tim mạch, Nội tiết – Đái tháo đường'],['Khu B','Trung tâm Khám sức khoẻ tổng quát']]],'4':['Tầng 4','Khám ngoại trú, thủ thuật',[['Khu A','Tiêu hoá – Gan mật, Cơ Xương Khớp'],['Khu B','Phòng nội soi, phòng hồi tỉnh']]],'5':['Tầng 5','Ngoại khoa',[['Khu A','Hồi sức tích cực'],['Khu B','Ngoại Tổng quát, khu hậu phẫu']]],'6':['Tầng 6','Phẫu thuật, Sản',[['Khu A','Phòng mổ'],['Khu B','Sản Phụ khoa, phòng sinh, chăm sóc sơ sinh']]],'7':['Tầng 7–9','Nội trú',[['Khu A','Phòng 2 giường'],['Khu B','Phòng đơn, có giường cho người nhà']]]};
$$('#bld .fl').forEach(function(b){b.addEventListener('click',function(){$$('#bld .fl').forEach(function(x){x.setAttribute('aria-pressed',x===b)});var f=FL[b.getAttribute('data-f')];$('#wayT').textContent=f[0];$('#wayS').textContent=f[1];$('#wayL').innerHTML=f[2].map(function(x){return '<li><b>'+x[0]+'</b>'+H.esc(x[1])+'</li>'}).join('')})});
})();

/* chuyên khoa + chi tiết khoa */
(function(){var H=window.HL;var $=H.$,$$=H.$$;
if(H.page==='khoa'){
  var sel=[],symBy={};H.D.sym.forEach(function(s){symBy[s.id]=s});
  var q=new URLSearchParams(location.search).get('tc');if(q&&symBy[q])sel.push(q);
  function paint(){
    $$('#symPick .chip').forEach(function(c){c.setAttribute('aria-pressed',sel.indexOf(c.getAttribute('data-s'))>-1)});
    var red=sel.some(function(id){return symBy[id].red});$('#symRed').hidden=!red;
    var normal=sel.filter(function(id){return !symBy[id].red});
    $('#symEmpty').hidden=sel.length>0;$('#symRes').hidden=!normal.length;
    $('#symCount').textContent=sel.length;
    var score={},why={};normal.forEach(function(id){symBy[id].k.forEach(function(k,i){score[k]=(score[k]||0)+(i===0?3:2);(why[k]=why[k]||[]).push(symBy[id].n)})});
    var ks=Object.keys(score).sort(function(a,b){return score[b]-score[a]}).slice(0,4),max=ks.length?score[ks[0]]:1;
    $('#symList').innerHTML=ks.map(function(id,i){var k=H.khoaBy[id];return '<li><span class="kico">'+H.ic(k.ic)+'</span><h3>'+(i===0?'Phù hợp hơn cả: ':'')+H.esc(k.n)+'</h3><span class="why">Liên quan: <b>'+H.esc(why[id].join(', '))+'</b><span class="meter"><i style="width:'+Math.round(score[id]/max*100)+'%"></i></span></span><span class="acts"><a class="btn btn-pri btn-sm" href="'+H.P+'dat-lich/?khoa='+id+'">Đặt lịch khoa này</a><a class="btn btn-ghost btn-sm" href="#k-'+id+'" data-flash="'+id+'">Xem khoa</a></span></li>'}).join('');
  }
  $$('#symPick .chip').forEach(function(c){c.addEventListener('click',function(){var id=c.getAttribute('data-s'),i=sel.indexOf(id);if(i>-1)sel.splice(i,1);else sel.push(id);paint()})});
  $('#symClear').addEventListener('click',function(){sel=[];paint()});
  $('#symQ').addEventListener('input',function(){var v=H.norm(this.value.trim());$$('#symPick .chip').forEach(function(c){c.hidden=v&&H.norm(c.textContent).indexOf(v)<0});$$('#symPick fieldset').forEach(function(f){f.hidden=!$$('.chip',f).some(function(c){return !c.hidden})})});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-flash]');if(!a)return;var el=$('#k-'+a.getAttribute('data-flash'));if(!el)return;$$('#kGroup button')[0].click();el.classList.add('flash');setTimeout(function(){el.classList.remove('flash')},2200)});
  $$('#kGroup button').forEach(function(b){b.addEventListener('click',function(){$$('#kGroup button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});var g=b.getAttribute('data-g');$$('#kGrid .kc').forEach(function(c){c.hidden=g&&c.getAttribute('data-g')!==g})})});
  paint();
  if(q)setTimeout(function(){$('#tim-trieu-chung').scrollIntoView()},50);
}
if(H.page==='khoa1'){
  /* mục trong trang */
  var links=$$('#subnav a'),secs=links.map(function(a){return $(a.getAttribute('href'))});
  function spy(){var y=innerHeight*.35,cur=null;secs.forEach(function(s,i){if(s.getBoundingClientRect().top<y)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
  addEventListener('scroll',spy,{passive:true});spy();
  /* danh sách chuẩn bị */
  var ck=$$('#prep input'),saved=H.lsGet('prep-tim',[]);
  function upd(){var n=ck.filter(function(c){return c.checked}).length;$('#prepTxt').textContent=n+'/'+ck.length+' đã chuẩn bị'+(n===ck.length?' · sẵn sàng đi khám':'');$('#prepBar').style.width=(n/ck.length*100)+'%';H.lsSet('prep-tim',ck.filter(function(c){return c.checked}).map(function(c){return c.value}))}
  ck.forEach(function(c){c.checked=saved.indexOf(c.value)>-1;c.addEventListener('change',upd)});upd();
}
})();

/* bác sĩ + hồ sơ bác sĩ */
(function(){var H=window.HL;var $=H.$,$$=H.$$;
var DS=['','T2','T3','T4','T5','T6','T7','CN'],DN=['','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật'];
H.drCard=function(d){var k=H.khoaBy[d.k],days=Object.keys(d.days).map(Number).sort();
  var dd='';for(var n=1;n<8;n++)dd+='<span'+(days.indexOf(n)>-1?' class="on"':'')+'>'+DS[n]+'</span>';
  return '<article class="dr" data-id="'+d.id+'"><button class="fav" type="button" data-fav="'+d.id+'" aria-pressed="false" aria-label="Lưu '+H.esc(H.drName(d))+' vào danh sách của tôi">'+H.ic('heart')+'</button><div class="dr-top">'+H.avatar(d)+'<div><small>'+k.n+'</small><h3><a href="'+H.P+'ho-so-bac-si/?id='+d.id+'">'+H.esc(H.drName(d))+'</a></h3></div></div><ul class="dr-meta"><li>'+H.ic('cap')+'<span>'+d.y+' năm kinh nghiệm</span></li><li>'+H.ic(k.ic)+'<span>'+H.esc(d.focus.slice(0,2).join(', '))+'</span></li></ul><div class="dr-days" role="img" aria-label="Ngày khám: '+days.map(function(n){return DN[n]}).join(', ')+'">'+dd+'</div><div class="dr-foot"><span class="dr-fee">Phí khám <b class="num">'+H.money(d.fee)+'</b></span><a class="btn btn-line btn-sm" href="'+H.P+'dat-lich/?bs='+d.id+'">Đặt lịch</a></div></article>'};

if(H.page==='bs'){
  var sp=new URLSearchParams(location.search),st={q:'',k:sp.get('khoa')||'',sex:'',day:[],ses:[],fav:false};
  if(sp.get('ngay'))st.day=[sp.get('ngay')];
  var cards=$$('#drGrid .dr');
  function apply(){var q=H.norm(st.q.trim()),f=H.favs(),n=0;
    cards.forEach(function(c){var ok=true,days=c.getAttribute('data-days').split(','),ses=c.getAttribute('data-ses');
      if(q&&H.norm(c.textContent+' '+c.getAttribute('data-name')).indexOf(q)<0)ok=false;
      if(st.k&&c.getAttribute('data-k')!==st.k)ok=false;
      if(st.sex&&c.getAttribute('data-sex')!==st.sex)ok=false;
      if(st.day.length&&!st.day.some(function(d){return days.indexOf(d)>-1}))ok=false;
      if(st.ses.length&&!st.ses.some(function(s){return ses.indexOf(s)>-1}))ok=false;
      if(st.fav&&f.indexOf(c.getAttribute('data-id'))<0)ok=false;
      c.classList.toggle('hide',!ok);if(ok)n++});
    $('#fCount').innerHTML='<b>'+n+'</b> bác sĩ phù hợp';$('#drEmpty').hidden=n>0;$('#drGrid').hidden=n===0;
    $('#fK').value=st.k;$$('#fSex button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===st.sex)});
    $$('#fDay .chip').forEach(function(b){b.setAttribute('aria-pressed',st.day.indexOf(b.getAttribute('data-v'))>-1)});
    $$('#fSes .chip').forEach(function(b){b.setAttribute('aria-pressed',st.ses.indexOf(b.getAttribute('data-v'))>-1)});
    $('#fFav').setAttribute('aria-pressed',st.fav);
    $$('.bs-bars a').forEach(function(a){a.classList.toggle('on',st.day.indexOf(a.getAttribute('data-day'))>-1)});
    try{var u=new URL(location.href);u.search='';if(st.k)u.searchParams.set('khoa',st.k);if(st.day.length===1)u.searchParams.set('ngay',st.day[0]);history.replaceState(null,'',u)}catch(e){}
  }
  function tog(a,v){var i=a.indexOf(v);if(i>-1)a.splice(i,1);else a.push(v)}
  $('#fQ').addEventListener('input',function(){st.q=this.value;apply()});
  $('#fK').addEventListener('change',function(){st.k=this.value;apply()});
  $$('#fSex button').forEach(function(b){b.addEventListener('click',function(){st.sex=b.getAttribute('data-v');apply()})});
  $$('#fDay .chip').forEach(function(b){b.addEventListener('click',function(){tog(st.day,b.getAttribute('data-v'));apply()})});
  $$('#fSes .chip').forEach(function(b){b.addEventListener('click',function(){tog(st.ses,b.getAttribute('data-v'));apply()})});
  $('#fFav').addEventListener('click',function(){st.fav=!st.fav;apply()});
  $$('.bs-bars a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();st.day=[a.getAttribute('data-day')];apply();$('#flt').scrollIntoView({behavior:H.RM?'auto':'smooth'})})});
  function reset(){st={q:'',k:'',sex:'',day:[],ses:[],fav:false};$('#fQ').value='';apply()}
  $('#fReset').addEventListener('click',reset);$('#fReset2').addEventListener('click',reset);
  H.onFav=function(){if(st.fav)apply()};
  apply();
}

if(H.page==='bs1'){
  var id=new URLSearchParams(location.search).get('id'),d=H.drBy[id]||H.drBy['le-hoang-minh-thu'],k=H.khoaBy[d.k];
  if(d.id!=='le-hoang-minh-thu'){
    document.title=d.t+' '+d.n+', '+k.n+' | BV Hải Lam';
    $('#pfK').textContent='Khoa '+k.n+' · '+k.loc;$('#pfT').textContent=d.t;$('#pfN').textContent=d.n;$('#crumbDr').textContent=H.drName(d);
    $('#pfBio').textContent=d.bio;$('#pfTags').innerHTML=d.focus.map(function(f){return '<li>'+H.esc(f)+'</li>'}).join('');
    $('#pfY').textContent=d.y;$('#pfFee').textContent=H.money(d.fee);$('#pfLang').textContent=d.lang;
    if(d.img){$('#pfImg').src=d.img.replace('w=480','w=900');$('#pfImg').alt='Chân dung '+H.drName(d)}
    else{var w=d.n.split(' ');$('#pfImg').hidden=true;var m=$('#pfMono');m.hidden=false;m.textContent=(w[w.length-2][0]+w[w.length-1][0]).toUpperCase();m.classList.toggle('nu',d.sex==='nu')}
    $('#pfFav').setAttribute('data-fav',d.id);
    $('#pfEdu').innerHTML=d.edu.map(function(e){return '<li><span class="num">'+e[0]+'</span><b>'+H.esc(e[1])+'</b></li>'}).join('');
    var wk='<div class="wk-r wk-h" role="row"><span role="columnheader"><span class="vh">Buổi</span></span>';for(var n=1;n<8;n++)wk+='<span role="columnheader">'+DS[n]+'</span>';wk+='</div>';
    'SCT'.split('').forEach(function(s){wk+='<div class="wk-r" role="row"><span role="rowheader">'+H.SES[s]+'</span>';for(var n=1;n<8;n++){var on=(d.days[n]||'').indexOf(s)>-1;wk+='<span role="cell" class="'+(on?'on':'')+'">'+(on?H.ic('check')+'<span class="vh">Có khám</span>':'<span class="vh">Không khám</span>')+'</span>'}wk+='</div>'});
    $('#pfWeek').innerHTML=wk;
    var rel=H.D.dr.filter(function(x){return x.k===d.k&&x.id!==d.id});if(!rel.length)rel=H.D.dr.filter(function(x){return x.id!==d.id}).slice(0,3);
    $('#relDr').innerHTML=rel.slice(0,3).map(H.drCard).join('');$('#relAll').href=H.P+'bac-si/?khoa='+d.k;
    H.paintFav();
  }
  /* chọn ngày giờ */
  var days=H.nextDays(14),selD=null,selT=null;
  function dayBtns(){$('#pkDays').innerHTML=days.map(function(x,i){var w=H.isoDow(x),on=!!d.days[w],free=on?H.slotsFor(d,x).filter(function(s){return !s.full}).length:0;
    return '<button type="button" class="dbtn" role="option" aria-selected="false" data-i="'+i+'"'+(free?'':' disabled')+'><small>'+(i===0?'Hôm nay':DS[w])+'</small><b class="num">'+H.pad(x.getDate())+'</b><em>'+(free?free+' khung trống':'Không khám')+'</em></button>'}).join('');
    $$('#pkDays .dbtn').forEach(function(b){b.addEventListener('click',function(){selD=+b.getAttribute('data-i');selT=null;$$('#pkDays .dbtn').forEach(function(x){x.setAttribute('aria-selected',x===b)});slots()})});
    var first=$('#pkDays .dbtn:not([disabled])');if(first)first.click()}
  function slots(){var x=days[selD],ss=H.slotsFor(d,x),h='';'SCT'.split('').forEach(function(s){var g=ss.filter(function(y){return y.s===s});if(!g.length)return;h+='<div><h3>Buổi '+H.SES[s].toLowerCase()+'</h3><div class="slots">'+g.map(function(y){return '<button type="button" class="sbtn" aria-pressed="false" data-t="'+y.t+'"'+(y.full?' disabled aria-label="'+y.t+', đã kín"':'')+'>'+y.t+'</button>'}).join('')+'</div></div>'});
    $('#pkSlots').innerHTML=h;$$('#pkSlots .sbtn').forEach(function(b){b.addEventListener('click',function(){selT=b.getAttribute('data-t');$$('#pkSlots .sbtn').forEach(function(z){z.setAttribute('aria-pressed',z===b)});sum()})});sum()}
  function sum(){var x=days[selD];$('#pkGo').disabled=!selT;$('#pkSum').innerHTML=selT?'<b>'+selT+'</b>, '+H.DOW[x.getDay()]+' '+H.fmtD(x)+' với '+H.esc(H.drName(d)):'Chọn một khung giờ còn trống.'}
  $('#pkGo').addEventListener('click',function(){var x=days[selD];H.lsSet('booking',{k:d.k,d:d.id,date:H.fmtD(x),t:selT,step:4});location.href=H.P+'dat-lich/'});
  dayBtns();
}
})();

/* đặt lịch nhiều bước */
(function(){var H=window.HL;if(H.page!=='dat')return;var $=H.$,$$=H.$$;
var sp=new URLSearchParams(location.search);
var S=H.lsGet('booking',{})||{};
if(sp.get('khoa')&&H.khoaBy[sp.get('khoa')]){S={k:sp.get('khoa'),step:2}}
if(sp.get('bs')&&H.drBy[sp.get('bs')]){var dq=H.drBy[sp.get('bs')];S={k:dq.k,d:dq.id,step:3}}
if(S.done){S={}}
S.f=S.f||{};S.for=S.for||'Bản thân';
var step=Math.min(Math.max(+S.step||1,1),5);
var days=H.nextDays(14);
function save(){S.step=step;H.lsSet('booking',S)}
function anyDr(){return S.d==='any'}
function drsOfK(){return H.D.dr.filter(function(d){return d.k===S.k})}
function slotsOn(date){var list=anyDr()?drsOfK():[H.drBy[S.d]].filter(Boolean),m={};
  list.forEach(function(d){H.slotsFor(d,date).forEach(function(s){if(!m[s.t]||(m[s.t].full&&!s.full))m[s.t]={t:s.t,s:s.s,full:s.full,dr:d}})});
  return Object.keys(m).sort().map(function(k){return m[k]})}
/* bước 1 */
$$('.kopt').forEach(function(b){b.addEventListener('click',function(){if(S.k!==b.getAttribute('data-k')){S.k=b.getAttribute('data-k');S.d=null;S.date=null;S.t=null}paint1();side();$('#e1').hidden=true;save()})});
function paint1(){$$('.kopt').forEach(function(b){b.setAttribute('aria-checked',b.getAttribute('data-k')===S.k)})}
/* bước 2 */
function paint2(){var k=H.khoaBy[S.k];if(!k)return;$('#s2p').textContent=drsOfK().length+' bác sĩ khoa '+k.n+'. Hoặc để hệ thống xếp bác sĩ có khung giờ sớm nhất.';
  var h='<button type="button" class="dopt" role="radio" aria-checked="'+anyDr()+'" data-d="any"><span class="any">'+H.ic('users')+'</span><span><b>Bác sĩ nào cũng được</b><small>Xếp vào khung giờ sớm nhất của khoa</small></span><span class="fee">từ '+H.money(250000)+'</span></button>';
  drsOfK().forEach(function(d){var ds=['','T2','T3','T4','T5','T6','T7','CN'],dd='';for(var n=1;n<8;n++)dd+='<span'+(d.days[n]?' class="on"':'')+'>'+ds[n]+'</span>';
    h+='<button type="button" class="dopt" role="radio" aria-checked="'+(S.d===d.id)+'" data-d="'+d.id+'">'+H.avatar(d)+'<span><b>'+H.esc(H.drName(d))+'</b><small>'+d.y+' năm kinh nghiệm · '+H.esc(d.focus.slice(0,2).join(', '))+'</small><span class="dr-days" aria-hidden="true">'+dd+'</span></span><span class="fee">'+H.money(d.fee)+'<small>phí khám</small></span></button>'});
  $('#bkDr').innerHTML=h;
  $$('#bkDr .dopt').forEach(function(b){b.addEventListener('click',function(){if(S.d!==b.getAttribute('data-d')){S.d=b.getAttribute('data-d');S.date=null;S.t=null}$$('#bkDr .dopt').forEach(function(x){x.setAttribute('aria-checked',x===b)});$('#e2').hidden=true;side();save()})})}
/* bước 3 */
var ds=['CN','T2','T3','T4','T5','T6','T7'];
function paint3(){if(S.date&&!curDate()){S.date=null;S.t=null}$('#bkDays').innerHTML=days.map(function(x,i){var free=slotsOn(x).filter(function(s){return !s.full}).length,v=H.fmtD(x);
    return '<button type="button" class="dbtn" role="option" aria-selected="'+(S.date===v)+'" data-v="'+v+'" data-i="'+i+'"'+(free?'':' disabled')+'><small>'+(i===0?'Hôm nay':ds[x.getDay()])+'</small><b class="num">'+H.pad(x.getDate())+'</b><em>'+(free?free+' khung trống':'Hết lịch')+'</em></button>'}).join('');
  $$('#bkDays .dbtn').forEach(function(b){b.addEventListener('click',function(){if(S.date!==b.getAttribute('data-v')){S.date=b.getAttribute('data-v');S.t=null}$$('#bkDays .dbtn').forEach(function(x){x.setAttribute('aria-selected',x===b)});slots3();side();save()})});
  if(!S.date){var f=$('#bkDays .dbtn:not([disabled])');if(f){S.date=f.getAttribute('data-v');f.setAttribute('aria-selected','true')}}
  slots3()}
function curDate(){for(var i=0;i<days.length;i++)if(H.fmtD(days[i])===S.date)return days[i];return null}
function slots3(){var x=curDate();if(!x){$('#bkSlots').innerHTML='<p>Không có lịch trong 14 ngày tới. Vui lòng chọn bác sĩ khác.</p>';return}
  var ss=slotsOn(x),h='';'SCT'.split('').forEach(function(s){var g=ss.filter(function(y){return y.s===s});if(!g.length)return;
    h+='<div><h3>Buổi '+H.SES[s].toLowerCase()+'</h3><div class="slots">'+g.map(function(y){return '<button type="button" class="sbtn" aria-pressed="'+(S.t===y.t)+'" data-t="'+y.t+'" data-dr="'+y.dr.id+'"'+(y.full?' disabled aria-label="'+y.t+', đã kín"':'')+'>'+y.t+'</button>'}).join('')+'</div></div>'});
  $('#bkSlots').innerHTML=h;
  $$('#bkSlots .sbtn').forEach(function(b){b.addEventListener('click',function(){S.t=b.getAttribute('data-t');S.anyDr=anyDr()?b.getAttribute('data-dr'):null;$$('#bkSlots .sbtn').forEach(function(z){z.setAttribute('aria-pressed',z===b)});$('#e3').hidden=true;side();save()})})}
/* bước 4 */
var F={name:'#fName',phone:'#fPhone',year:'#fYear',sex:'#fSex',email:'#fMail',ins:'#fIns',note:'#fNote'};
Object.keys(F).forEach(function(k){var el=$(F[k]);if(S.f[k])el.value=S.f[k];el.addEventListener('input',function(){S.f[k]=el.value;save()});el.addEventListener('change',function(){S.f[k]=el.value;save()})});
$$('#bkFor button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-v')===S.for);b.addEventListener('click',function(){S.for=b.getAttribute('data-v');$$('#bkFor button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('label[for=fName]').textContent=S.for==='Con nhỏ'?'Họ và tên của bé *':'Họ và tên người đi khám *';save()})});
/* bước 5 */
function drLabel(){if(!S.d)return '';if(anyDr()){var a=H.drBy[S.anyDr];return a?'Bác sĩ nào cũng được (dự kiến: '+H.drName(a)+')':'Bác sĩ nào cũng được'}return H.drName(H.drBy[S.d])}
function rows(edit){var x=curDate();var r=[['Chuyên khoa',H.khoaBy[S.k].n+' · '+H.khoaBy[S.k].loc,1],['Bác sĩ',drLabel(),2],['Ngày giờ',S.t+', '+H.DOW[x.getDay()]+' '+S.date,3],['Đặt cho',S.for,4],['Người đi khám',S.f.name+' · '+(S.f.sex||'')+' · sinh năm '+S.f.year,4],['Điện thoại',S.f.phone,4]];
  if(S.f.email)r.push(['Email',S.f.email,4]);r.push(['Thanh toán',S.f.ins||'Tự thanh toán',4]);if(S.f.note)r.push(['Lý do khám',S.f.note,4]);
  return r.map(function(y){return '<div><dt>'+y[0]+'</dt><dd>'+H.esc(y[1])+'</dd>'+(edit?'<button type="button" class="btn btn-ghost" data-go="'+y[2]+'">'+H.ic('edit')+'Sửa</button>':'')+'</div>'}).join('')}
function paint5(){$('#rev').innerHTML=rows(true);$$('#rev [data-go]').forEach(function(b){b.addEventListener('click',function(){go(+b.getAttribute('data-go'))})})}
/* tóm tắt */
function side(){var k=H.khoaBy[S.k];function set(id,v){var e=$(id);e.textContent=v||'Chưa chọn';e.classList.toggle('empty-v',!v)}
  set('#sK',k&&k.n);set('#sD',drLabel());set('#sT',S.t&&S.date?S.t+' · '+S.date:'');$('#sL').textContent=k?k.loc:'Tầng trệt Khu A';
  var d=H.drBy[S.d];$('#sF').textContent=d?H.money(d.fee):'từ '+H.money(250000)}
/* điều hướng */
function valid(n){if(n===1&&!S.k){$('#e1').hidden=false;return false}if(n===2&&!S.d){$('#e2').hidden=false;return false}if(n===3&&!(S.date&&S.t)){$('#e3').hidden=false;return false}if(n===4)return H.validate($('[data-step="4"]'));return true}
function maxOk(){if(!S.k)return 1;if(!S.d)return 2;if(!(S.date&&S.t))return 3;if(!(S.f.name&&S.f.phone&&S.f.year&&S.f.sex))return 4;return 5}
function go(n,focus){if(n>maxOk())n=Math.min(maxOk(),n);step=n;
  $$('.bk-step').forEach(function(s){s.hidden=+s.getAttribute('data-step')!==n});
  $$('#stepper li').forEach(function(li){var s=+li.getAttribute('data-s');li.classList.toggle('cur',s===n);li.classList.toggle('past',s<n);var b=$('button',li);b.disabled=s>maxOk()&&s!==n;if(s===n)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  if(n===1)paint1();if(n===2)paint2();if(n===3)paint3();if(n===5)paint5();
  $('#bkBack').style.visibility=n===1?'hidden':'visible';
  $('#bkNext').querySelector('span').textContent=n===5?'Xác nhận đặt lịch':n===4?'Xem lại thông tin':'Tiếp tục';
  save();side();
  if(focus!==false){var h=$('[data-step="'+n+'"] h2');h.setAttribute('tabindex','-1');h.focus({preventScroll:true});var top=$('#stepper').getBoundingClientRect().top+pageYOffset-90;if(pageYOffset>top)scrollTo({top:top,behavior:H.RM?'auto':'smooth'})}}
$('#bkNext').addEventListener('click',function(){if(!valid(step))return;if(step<5)go(step+1);else submit()});
$('#bkBack').addEventListener('click',function(){if(step>1)go(step-1)});
$$('#stepper button').forEach(function(b,i){b.addEventListener('click',function(){var n=i+1;if(n>step&&!valid(step))return;go(n)})});
$('#bk').addEventListener('submit',function(e){e.preventDefault()});
function submit(){if(!$('#fAgree').checked){go(4);H.validate($('[data-step="4"]'));return}
  var code=H.code('HL');$('#bkCode').textContent=code;$('#bkDoneSum').innerHTML=rows(false);
  $('#bk').hidden=true;$('#bkDone').hidden=false;$('#bkDone').focus();
  $$('#stepper li').forEach(function(li){li.classList.remove('cur');li.classList.add('past');$('button',li).disabled=true});
  H.lsSet('last-booking',{code:code,k:S.k,date:S.date,t:S.t});H.lsSet('booking',{done:1});
  scrollTo({top:0,behavior:H.RM?'auto':'smooth'})}
$('#bkPrint').addEventListener('click',function(){print()});
$('#bkNew').addEventListener('click',function(){H.lsSet('booking',{});location.href=location.pathname});
go(Math.min(step,maxOk()),false);
})();

/* gói khám */
(function(){var H=window.HL;if(H.page!=='goi')return;var $=H.$,$$=H.$$;
var G=H.lsGet('goi',{sex:1,age:35});var sex=+G.sex,age=+G.age;
function recIdx(a){return a<30?0:a<45?1:a<60?2:3}
function fill(r){var p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty('--p',p+'%')}
function paint(){var i=recIdx(age),p=H.D.pkg[i];
  $$('#gSex button,#tSex button').forEach(function(b){b.setAttribute('aria-pressed',+b.getAttribute('data-v')===sex)});
  $('#gAge').value=age;$('#gAgeV').textContent=age;fill($('#gAge'));
  $('#gRecN').textContent='Gói '+p.n;$('#gRecP').textContent=H.money(p.price[sex]);$('#gRecD').textContent=p.d+' Phù hợp '+p.age+'.';$('#gRecGo').href='#g-'+p.id;
  $$('.cmp-p').forEach(function(e){e.textContent=H.money(+e.getAttribute('data-p'+sex))});
  var no=sex?'nam':'nu',diff=$('#tDiff').checked;
  $$('#cmp tbody tr[data-sex]').forEach(function(tr){var s=tr.getAttribute('data-sex');tr.classList.toggle('off',(s===no)||(diff&&tr.getAttribute('data-diff')==='0'))});
  $$('#cmp [data-c]').forEach(function(c){c.classList.toggle('hl',+c.getAttribute('data-c')===i)});
  H.lsSet('goi',{sex:sex,age:age})}
$$('#gSex button,#tSex button').forEach(function(b){b.addEventListener('click',function(){sex=+b.getAttribute('data-v');paint()})});
$('#gAge').addEventListener('input',function(){age=+this.value;paint()});
$('#tDiff').addEventListener('change',paint);
paint();
/* tính giá doanh nghiệp */
var ins=$$('#bizRows .inp'),fem=$('#bizF');
function calc(){var f=+fem.value/100,n=0,sub=0;fill(fem);$('#bizFV').textContent=fem.value+'%';
  ins.forEach(function(inp){var v=Math.max(0,Math.min(5000,parseInt(inp.value.replace(/\D/g,''),10)||0));if(String(v)!==inp.value&&document.activeElement!==inp)inp.value=v;var p=H.D.pkg[+inp.getAttribute('data-i')].price;n+=v;sub+=v*(p[0]*(1-f)+p[1]*f)});
  sub=Math.round(sub/1000)*1000;var pct=n>=100?12:n>=50?8:n>=20?5:0,disc=Math.round(sub*pct/100/1000)*1000;
  var on=$('#bizOn').checked&&n>=50,onv=on?Math.ceil(n/120)*3000000:0;
  $('#bizOn').disabled=n<50;if(n<50)$('#bizOn').checked=false;
  $('#bizN').textContent=n;$('#bizSub').textContent=H.money(sub);$('#bizPct').textContent=pct+'%';$('#bizDisc').textContent=(disc?'−':'')+H.money(disc);
  $('#bizOnRow').hidden=!on;$('#bizOnV').textContent=H.money(onv);
  var tot=sub-disc+onv;anim($('#bizTotal'),tot);$('#bizPer').textContent=H.money(n?Math.round(tot/n/1000)*1000:0);
  $$('#bizTier li').forEach(function(li){li.classList.toggle('on',+li.getAttribute('data-n')===(pct===12?100:pct===8?50:pct===5?20:-1))});
  var names=H.D.pkg.map(function(p,i){var v=+ins[i].value||0;return v?v+' người gói '+p.n:''}).filter(Boolean);
  $('#qNote').value=n?'Dự kiến '+n+' nhân viên ('+names.join(', ')+'), khoảng '+fem.value+'% nữ. Ước tính trên web: '+H.money(tot)+'.':'';
  H.lsSet('biz',{v:ins.map(function(x){return +x.value||0}),f:+fem.value})}
var cur=0,raf;function anim(el,to){cancelAnimationFrame(raf);if(H.RM||H.STATIC){cur=to;el.textContent=H.money(to);return}var from=cur,t0=performance.now();(function st(t){var k=Math.min(1,(t-t0)/450),e=1-Math.pow(1-k,3);cur=Math.round(from+(to-from)*e);el.textContent=H.money(Math.round(cur/1000)*1000);if(k<1)raf=requestAnimationFrame(st);else cur=to})(t0)}
var B=H.lsGet('biz',null);if(B&&B.v){ins.forEach(function(x,i){x.value=B.v[i]||0});fem.value=B.f}
ins.forEach(function(x){x.addEventListener('input',calc);x.addEventListener('blur',calc)});
$$('#bizRows [data-d]').forEach(function(b){b.addEventListener('click',function(){var x=b.parentNode.querySelector('.inp');x.value=Math.max(0,(+x.value||0)+(+b.getAttribute('data-d')));calc()})});
fem.addEventListener('input',calc);$('#bizOn').addEventListener('change',calc);
calc();
})();

/* hướng dẫn, kiến thức, liên hệ */
(function(){var H=window.HL;var $=H.$,$$=H.$$;
function spy(links,off){var secs=links.map(function(a){return $(a.getAttribute('href'))});function f(){var y=innerHeight*(off||.3),cur=null;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<y)cur=i});links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}addEventListener('scroll',f,{passive:true});f()}
function hlText(el,q){var t=el.getAttribute('data-o');if(t===null){t=el.textContent;el.setAttribute('data-o',t)}if(!q){el.textContent=t;return}var n=H.norm(t),i=n.indexOf(q);if(i<0){el.textContent=t;return}el.innerHTML=H.esc(t.slice(0,i))+'<mark>'+H.esc(t.slice(i,i+q.length))+'</mark>'+H.esc(t.slice(i+q.length))}

if(H.page==='hd'){
  spy($$('#toc a'));
  /* bảng giá */
  var cat='',q='';var sp=new URLSearchParams(location.search);if(sp.get('q')){q=sp.get('q');$('#prQ').value=q}
  function pr(){var nq=H.norm(q.trim()),shown={},n=0;
    $$('#prT tbody tr:not(.pr-g)').forEach(function(tr){var th=$('th',tr),ok=(!cat||tr.getAttribute('data-c')===cat)&&(!nq||H.norm(tr.textContent).indexOf(nq)>-1);tr.classList.toggle('off',!ok);hlText(th,nq);if(ok){shown[tr.getAttribute('data-c')]=1;n++}});
    $$('#prT .pr-g').forEach(function(g){g.classList.toggle('off',!shown[g.getAttribute('data-c')])});
    $('#prEmpty').hidden=n>0;$$('#prCat .chip').forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-c')===cat)})}
  $('#prQ').addEventListener('input',function(){q=this.value;pr()});
  $$('#prCat .chip').forEach(function(c){c.addEventListener('click',function(){cat=c.getAttribute('data-c');pr()})});pr();
  /* bảo hiểm */
  $('#insSel').addEventListener('change',function(){var o=this.options[this.selectedIndex],r=$('#insRes');if(!this.value){r.hidden=true;return}r.hidden=false;var ok=o.getAttribute('data-ok')==='1';
    r.className='ins-res '+(ok?'ok':'no');r.innerHTML=ok?H.ic('check')+'<span><b>Bảo lãnh viện phí trực tiếp</b> cho: '+H.esc(o.getAttribute('data-sc'))+'. Xuất trình thẻ bảo hiểm và căn cước tại quầy bảo hiểm Tầng 1, Khu A trước khi khám.</span>':H.ic('info')+'<span><b>Chưa bảo lãnh trực tiếp.</b> Bạn thanh toán trước, bệnh viện cung cấp đủ hoá đơn, chứng từ để bạn gửi công ty bảo hiểm yêu cầu hoàn trả.</span>'});
  /* giờ thăm */
  var now=new Date(),m=now.getHours()*60+now.getMinutes(),open=(m>=660&&m<780)||(m>=1020&&m<1200),vn=$('#visitNow');
  vn.classList.toggle('closed',!open);vn.innerHTML='<i></i><span>'+(open?'<b>Đang trong giờ thăm bệnh</b> khu nội trú chung (theo giờ trên máy của bạn).':'<b>Ngoài giờ thăm bệnh.</b> Khung tiếp theo: '+(m<660?'11:00 hôm nay':m<1020?'17:00 hôm nay':'11:00 ngày mai')+'.')+'</span>';
  /* hỏi đáp */
  $('#faqQ').addEventListener('input',function(){var v=H.norm(this.value.trim()),n=0;$$('#faq .acc-item').forEach(function(it){var ok=!v||H.norm(it.textContent).indexOf(v)>-1;it.hidden=!ok;if(ok)n++;if(v&&ok)$('.acc-btn',it).setAttribute('aria-expanded','true')});$('#faqEmpty').hidden=n>0});
}

if(H.page==='kt'){
  var cat2='';
  function ft(){var v=H.norm($('#ktQ').value.trim()),n=0;$$('#artGrid .art').forEach(function(a){var ok=(!cat2||a.getAttribute('data-k')===cat2)&&(!v||H.norm(a.getAttribute('data-t')).indexOf(v)>-1);a.classList.toggle('hide',!ok);if(ok)n++});
    $('#ktCount').textContent=n+' bài viết';$('#ktEmpty').hidden=n>0;$$('#ktCat .chip').forEach(function(c){c.setAttribute('aria-pressed',c.getAttribute('data-c')===cat2)})}
  $$('#ktCat .chip').forEach(function(c){c.addEventListener('click',function(){cat2=c.getAttribute('data-c');ft()})});$('#ktQ').addEventListener('input',ft);
  $$('.art-tg').forEach(function(b){b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true',p=document.getElementById(b.getAttribute('aria-controls'));b.setAttribute('aria-expanded',!o);p.hidden=o;b.firstChild.nodeValue=o?'Đọc nhanh 3 ý chính':'Thu gọn'})});
  if(/^#bai-/.test(location.hash)){var a=$(location.hash);if(a){var tg=$('.art-tg',a);if(tg)tg.click()}}
  spy($$('#postToc a'),.25);
  var bar=$('#rprog'),post=$('#postBody');function rp(){var r=post.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight*.6)));bar.style.transform='scaleX('+p+')'}addEventListener('scroll',rp,{passive:true});rp();
  var fs=+H.lsGet('fs',1)||1;function sf(){post.style.setProperty('--pf',fs);H.lsSet('fs',fs)}sf();
  $$('.post-fs button').forEach(function(b){b.addEventListener('click',function(){fs=Math.min(1.3,Math.max(.9,Math.round((fs+(+b.getAttribute('data-fs'))*.1)*10)/10));sf();H.toast('Cỡ chữ '+Math.round(fs*100)+'%')})});
  /* nhật ký huyết áp */
  var L=H.lsGet('bp',[]);
  function bpPaint(){$('#bpList').innerHTML=L.map(function(x,i){return '<li>'+x.w+' '+x.s+'/'+x.d+'<button type="button" data-i="'+i+'" aria-label="Xoá lần đo '+x.s+'/'+x.d+'">'+H.ic('close')+'</button></li>'}).join('');
    $('#bpN').textContent=L.length;if(L.length){var s=0,d=0;L.forEach(function(x){s+=x.s;d+=x.d});$('#bpAvg').textContent=Math.round(s/L.length)+' / '+Math.round(d/L.length)}else $('#bpAvg').textContent='– / –';
    $$('#bpList button').forEach(function(b){b.addEventListener('click',function(){L.splice(+b.getAttribute('data-i'),1);H.lsSet('bp',L);bpPaint()})});$('#bpClr').hidden=!L.length}
  $('#bpF').addEventListener('submit',function(e){e.preventDefault();var s=+$('#bpS').value,d=+$('#bpD').value,ok=s>=50&&s<=260&&d>=30&&d<=160&&s>d;$('#bpErr').hidden=ok;if(!ok){$('#bpS').focus();return}L.push({s:s,d:d,w:$('#bpW').value});if(L.length>14)L.shift();H.lsSet('bp',L);$('#bpS').value='';$('#bpD').value='';$('#bpS').focus();bpPaint()});
  $('#bpClr').addEventListener('click',function(){L=[];H.lsSet('bp',L);bpPaint()});bpPaint();
  $('#copyLink').addEventListener('click',function(){var u=location.href.split('#')[0]+'#do-huyet-ap-tai-nha';try{navigator.clipboard.writeText(u).then(function(){H.toast('Đã sao chép liên kết bài viết')},function(){H.toast(u)})}catch(e){H.toast(u)}});
  var sv=H.lsGet('saved-art',[]),sb=$('#saveArt');function sp2(){var on=sv.indexOf('do-huyet-ap-tai-nha')>-1;sb.setAttribute('aria-pressed',on);sb.querySelector('span').textContent=on?'Đã lưu':'Lưu bài'}
  sb.addEventListener('click',function(){var i=sv.indexOf('do-huyet-ap-tai-nha');if(i>-1)sv.splice(i,1);else sv.push('do-huyet-ap-tai-nha');H.lsSet('saved-art',sv);sp2();H.toast(i>-1?'Đã bỏ lưu bài viết':'Đã lưu bài viết trên máy này')});sp2();
}

if(H.page==='lh'){
  var map=$('#map');
  $$('#mode button').forEach(function(b){b.addEventListener('click',function(){var m=b.getAttribute('data-m');map.setAttribute('data-m',m);$$('#mode button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$$('#dir>[data-m]').forEach(function(d){d.hidden=d.getAttribute('data-m')!==m})})});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){map.classList.toggle('paused',!e.isIntersecting)})}).observe(map);
  var msg=$('#cMsg');msg.addEventListener('input',function(){$('#cCnt').textContent=msg.value.length});
  var sp3=new URLSearchParams(location.search),t=sp3.get('chu-de');if(t){$('#cTopic').value=t;var g=sp3.get('goi');if(g){var p=H.D.pkg.filter(function(x){return x.id===g})[0];if(p){msg.value='Tôi muốn đăng ký Gói khám '+p.n+'. Vui lòng gọi lại để hẹn ngày khám.';$('#cCnt').textContent=msg.value.length}}}
}
})();
