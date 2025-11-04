import React from "react";
import VoiceNotes from "../Voicenote/Voicenote";
import { Link } from "react-router-dom";
export default function () {
  return (
    <>
      <div className="container p-5">
        <span className="me-auto ">
          <Link to="/activites">
            <i class="fa-solid fa-arrow-right"></i>
          </Link>
        </span>
        <div className="content d-flex mt-4">
          <div className="report p-3 d-flex ">
            <ul className="list-unstyled fw-bolder">
              <li className="mb-2"> رقم الهوية :</li>
              <li className="mb-2"> اسم النشاط: </li>
              <li className="mb-2"> نوع النشاط :</li>
              <li className="mb-2"> العميل:</li>
              <li className="mb-2">العامل:</li>
              <li className="mb-2"> التوقيت المحدد:</li>
              <li className="mb-2">التاريخ المحدد:</li>
              <li className="mb-2">الموقع المحدد :</li>
              <li className="mb-2">التوقيت الفعلي:</li>
              <li className="mb-2">التاريخ الفعلي:</li>
              <li className="mb-2">الموقع الفعلي:</li>
            </ul>
            <ul className="list-unstyled">
              <li className="mb-2"> #2223</li>
              <li className="mb-2"> نشاط 1</li>
              <li className="mb-2">توصيل </li>
              <li className="mb-2">الاهلي ممكن</li>
              <li className="mb-2">أحمد سيد عصام</li>
              <li className="mb-2"> 9:00 صباحا</li>
              <li className="mb-2">12 ابريل </li>
              <li className="mb-2"> ش عباس العقاد مدينة نصر,القاهرة</li>
              <li className="mb-2"> 9:00 صباحا</li>
              <li className="mb-2">12 ابريل </li>
              <li className="mb-2">ش عباس العقاد مدينة نصر,القاهرة </li>
            </ul>
          </div>
          <div className="notes me-5 fw-bolder">
            <div className="voice">
              <p>مذكرة صوتية :</p>
              <VoiceNotes></VoiceNotes>
            </div>
            <div className="pic">
              <p>صور :</p>
            </div>
            <div className="note">
              <p>ترك ملاحظة :</p>
              <textarea
                name=""
                id=""
                cols="50"
                placeholder=" ملاحظتك"
                rows="5"
                className="form-control"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
