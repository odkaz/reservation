<!DOCTYPE html>
<html lang="en">
  <head>
    <base target="_top">
    <title>Reservation</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <!-- Flatpickr -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.2.3/flatpickr.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.2.3/themes/dark.css">
  <style>
    body {
      padding: 40px;
    }
    .form-container {

    }
    .date-container {
      border: 2px solid whitesmoke;
      border-radius: 10px;
      padding: 40px;
    }
  </style>
  </head>
  <body>
    <div class="form-container">
      <form>
        <div class="date-container">
          <div class="mb-3">
            <label for="datePicker" class="form-label">Resevation date</label>
            <input type="text" class="form-control" id="datePicker" placeholder="Please select Date Time">
          </div>
          <div class="mb-3">
            <label for="seatNum" class="form-label">Seats</label>
            <select id="seatNum" class="form-select">
              <option selected>Please select number of seats</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
            </select>
          </div>
          <button type="button" onClick="getTimeSlots()" class="btn btn-dark">Search</button>
        </div>
        <div id="slotContainer" class="slot-container">
        </div>

      </form>
    </div>

    <div>
      <!-- <span><?= message ?></span> -->
      <?var url = getUrl();?><input type="hidden" value="<?= url ?>" id="url" />
    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flatpickr/4.2.3/flatpickr.js"></script>
    <script>
      $("#datePicker").flatpickr({
          enableTime: false,
          dateFormat: "F, d Y",
          onChange: () => clearSlots()
      });

      const clearSlots = () => {
        $("#slotContainer").html(``);
      }

      function getTimestampFromDate(date) {
          try {
              if (!date) return "";
              const dateArr = date.split("/");
              const now = new Date(dateArr[2], parseInt(dateArr[0]) - 1, dateArr[1]);
              return now.getTime();
          } catch (error) {
              console.log(error);
              return "";
          }
      }

      const getTimeSlots = () => {
        $("#slotContainer").html(`
          <label for="lunchSlots" class="form-label mt-4">Lunch</label>
          <div id="lunchSlots" class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
          </div>
          <label for="dinnerSlots" class="form-label mt-4">Dinner</label>
          <div id="dinnerSlots" class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
          </div>`
        );
        console.log($("#datePicker").val());
        let dataToSend = {
          date: $("#datePicker").val(),
          seats: $("#seatNum").val(),
        };
        console.log(dataToSend);
        google.script.run.withSuccessHandler(gotSlots).getAvailableSlots(dataToSend);
      //       showLoaderScreen();
      }

        function gotSlots(result) {
          const slots = JSON.parse(result);
          console.log(slots);
          setSlots(slots);
          // hideLoaderScreen();
        }

        function formatTime(stamp) {
          let d = new Date(stamp);
          let hr = d.getUTCHours();
          let min = d.getUTCMinutes();
          if (min < 10) {
            min = "0" + min;
          }
          return hr + ':' + min;
        }

        function setSlots(slots) {
          //lunch slots
          if (slots.lunch.length == 0) {
            $("#lunchSlots").append(`<div>No Slots Available</div>`);
          } else {
            for (i = 0; i < slots.lunch.length; i++) {
              $("#lunchSlots").append(`<button id="lunchSlot-${i}" type="button" class="btn btn-outline-dark">${formatTime(slots.lunch[i].time)}</button>`);
              $(`#lunchSlot-${i}`).on("click", {'param': slots.lunch[i]}, function(e) {
                // submitReservation(e.data.param);
                Link1(e.data.param);
              });
            }
          }
          //dinner slots
          if (slots.dinner.length == 0) {
            $("#dinnerSlots").append(`<div>No Slots Available</div>`);
          } else {
            for (i = 0; i < slots.dinner.length; i++) {
              $("#dinnerSlots").append(`<button id="dinnerSlot-${i}" type="button" class="btn btn-outline-dark">${formatTime(slots.dinner[i].time)}</button>`);
              $(`#dinnerSlot-${i}`).on("click", {'param': slots.dinner[i]}, function(e) {
                // submitReservation(e.data.param);
                Link1(e.data.param);
              });
            }
          }
        }

      function getDateString(date) {
        let currentDate = new Date(date);
        let currentDayOfMonth = currentDate.getDate();
        let currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
        let currentYear = currentDate.getFullYear();

        let dateString = (currentMonth + 1) + "/" + currentDayOfMonth + "/" + currentYear;
        // "27-11-2020"
        return dateString;
      }

      function Link1(data) {
        let date = getDateString($("#datePicker").val());
        let time = formatTime(data.time);
        let seats = $("#seatNum").val();
        let isTable = data.isTable;
        let url = document.getElementById("url").value;
        let link = document.createElement('a');
        link.href = url+"?date="+date+"&time="+time+"&seats="+seats+"&isTable="+isTable+"&page=personalInfo";
        link.id = 'linkURL';
        document.body.appendChild(link);
        document.getElementById("linkURL").click();
      }
    </script>
  </body>
</html>
