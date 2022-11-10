var enquiryConfirmation = document.getElementById('EnquiryConfirmation')
var cruiseLocations = {}
var accommodationLongitude = ''
var accommodationLatitude = ''
enquiryConfirmation.style.display = 'none'

document.getElementById('defaultOpen').click()

$('input:radio[name=rdfeedback]:visible')[0].checked = true

$('.cruise-itinerary-details').each(function (i) {
  const val = $(this).val().split('||')
  cruiseLocations[i] = val.reduce(function (r, e, i) {
    if (i % 2) r[val[i - 1]] = e
    return r
  }, {})
})

function CallWebService() {
  var replyAddress = document.getElementById('HFReplyAddress').value
  var quoteId = document.getElementById('HFQuoteId').value
  var choice = ''
  var antirbt = document.getElementById('antirbt').value
  var enquiryForm = document.getElementById('EnquiryForm')
  var enquiryConfirmation = document.getElementById('EnquiryConfirmation')
  var rd = document.getElementsByName('rdfeedback')
  var feedback = document.getElementById('TAfeedback').value
  var crmurl = document.getElementById('HFCRMURL').value
  var serviceUrl = 'Services/QuoteFeedbackService.asmx/PostQuoteFeedback'
  var vid = document.getElementById('HFVID').value
  enquiryForm.style.display = 'none'
  enquiryConfirmation.style.display = 'block'
  for (var i = 0; i < rd.length; i++) {
    if (rd[i].checked) choice = rd[i].value
  }
  if (antirbt === '') {
    $.post({
      url: crmurl + serviceUrl,
      data: {
        quoteId: quoteId,
        replyAddress: replyAddress,
        crmurl: crmurl,
        choice: choice,
        feedback: feedback,
        vid: vid,
      },
      success: function () {},
      error: function () {
        alert('there was an error')
      },
    })
  }
}

function openSection(section, evt) {
  event.preventDefault()

  let i
  let tabContent = document.getElementsByClassName('tab-content')
  let tablink = document.getElementsByClassName('tab-link')

  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = 'none'
  }

  for (i = 0; i < tablink.length; i++) {
    tablink[i].className = tablink[i].className.replace(' active', '')
  }

  document.getElementById(section).style.display = 'block'
  evt.currentTarget.className += ' active'
}

function initMap() {
  if (
    $('#accommodationLongitude').length &&
    $('#accommodationLatitude').length
  ) {
    accommodationLatitude = $('#accommodationLatitude').val()
    accommodationLongitude = $('#accommodationLongitude').val()

    initAccommodationMap()
  } else {
    $('#accommodationMap').hide()
  }
  if (Object.keys(cruiseLocations).length !== 0) {
    const stops = Object.keys(cruiseLocations).length
    const theMiddle = Math.floor(stops / 2)
    let centrelong = cruiseLocations[theMiddle].Longitude
    let marker, i
    let bounds = new google.maps.LatLngBounds()

    if (centrelong !== '') {
      const map = new google.maps.Map(document.getElementById('map'), {
        streetViewControl: true,
      })

      for (i = 0; i < stops; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(
            cruiseLocations[i].Latitude,
            cruiseLocations[i].Longitude,
          ),
          map: map,
          title: cruiseLocations[i].Name,
          label: { text: cruiseLocations[i].Day, color: 'white' },
        })
        const infowindow = new google.maps.InfoWindow({
          content: cruiseLocations[i].Name,
        })
        google.maps.event.addListener(
          marker,
          'mouseover',
          (function (marker, i) {
            return function () {
              infowindow.setContent(cruiseLocations[i].NAME)
              infowindow.open(map, marker)
            }
          })(marker, i),
        )
        google.maps.event.addListener(
          marker,
          'mouseout',
          (function (marker) {
            return function () {
              infowindow.close(map, marker)
            }
          })(marker, i),
        )

        map.setCenter(bounds.getCenter())
        map.fitBounds(bounds.extend(marker.position))
        map.setZoom(map.getZoom() - 1)
      }
    } else {
      $('#map').hide()
      $('#TitlePortsOfCall').hide()
    }
  }
}

function initAccommodationMap() {
  let accommodationMap = new google.maps.Map(
    document.getElementById('accommodationMap'),
    {
      center: new google.maps.LatLng(
        accommodationLatitude,
        accommodationLongitude,
      ),
      zoom: 8,
    },
  )
  const infowindow = new google.maps.InfoWindow({
    content: '<div id="content">' + accommodationName + '</div>',
  })
  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(
      accommodationLatitude,
      accommodationLongitude,
    ),
    map: accommodationMap,
    title: '',
  })
  infowindow.open(accommodationMap, marker)
}
