function ajaxCallBack(imeFajla, ispis) {
  $.ajax({
    url: "data/" + imeFajla,
    method: "get",
    dataType: "json",
    success: ispis,
    error: function (xhr) {
      console.log(xhr);
    }
  })
}
function ubacivanje(naziv, vrednost) {
  localStorage.setItem(naziv, JSON.stringify(vrednost));
}
function dohvatanje(naziv) {
  return JSON.parse(localStorage.getItem(naziv));
}
if (dohvatanje("korpa") == null) {
  ubacivanje("korpa", []);
}
let hamburger = document.querySelector("#hamburger");
let navMenu = document.querySelector(".nav-menu");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
})
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}))
window.addEventListener("scroll", () => {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
})
window.onclick = function (event) {
  if (event.target != hamburger) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");

  }
}
window.addEventListener("load", function () {
  var preloader = document.querySelector(".preloader");

  setTimeout(function () {
    preloader.classList.add("preloader-finish");
    var element = document.getElementById("all");
    element.style.opacity = 1;
    element.style.transition = "opacity 1s ease-in-out";
  }, 1000);
});
ajaxCallBack("menu.json", function (rezultat) {
  ispisNav(rezultat);
})
function ispisNav(nizZaIspis) {
  let ul = document.querySelector(".nav-menu");
  let nav = "";

  for (let obj of nizZaIspis) {
    nav += `<li class="nav-item mr-lg-2 mb-lg-0 mb-2">
    <a class="nav-link" href="${obj.putanja}">${obj.stranica}</a>
    </li>`
  }


  ul.innerHTML = nav;
}
function filtriranje(proizvodi, tip, filter) {
  var filtriraniProizvodi;
  var nizBrendova = [];
  var pomocni_niz = []
  if (tip == "brend") {
    var DohvatiCHC = document.querySelectorAll(".brand input");
    DohvatiCHC.forEach(c => {

      if (c.checked == true) {
        nizBrendova.push(c.value)
        ubacivanje("brend", c.value);
      }

    });
    if (nizBrendova.length == 0) {
      filtriraniProizvodi = proizvodi;
    }
    else {
      filtriraniProizvodi = proizvodi.filter(proizvod => nizBrendova.some(element => proizvod[filter] == element))

    }

  }
  var nizPopusta = [];
  if (tip == "popust") {
    var DohvatiCHC = document.querySelectorAll(".popust input");
    DohvatiCHC.forEach(c => {

      if (c.checked == true) {
        nizPopusta.push(c.value)
        ubacivanje("popust", c.value);
      }

    });
    if (nizPopusta.length == 0) {
      filtriraniProizvodi = proizvodi;
    }
    else {
      filtriraniProizvodi = proizvodi.filter(proizvod => nizPopusta.some(element => proizvod[filter] == element))
    }

  }
  var nizOcena = [];
  if (tip == "ocena") {
    var DohvatiCHC = document.querySelectorAll(".ocena input");
    DohvatiCHC.forEach(c => {

      if (c.checked == true) {
        nizOcena.push(c.value)
        ubacivanje("ocena", c.value);
      }

    });
    if (nizOcena.length == 0) {
      filtriraniProizvodi = proizvodi;
    }
    else {
      filtriraniProizvodi = proizvodi.filter(proizvod => nizOcena.some(element => proizvod[filter] == element))
    }
  }
  return filtriraniProizvodi;
}
function filtriranjeCena(proizvodi) {
  var filtriraniProizvodi;
  var nizCena = [];

  var DohvatiCHC = document.querySelectorAll(".cena input");
  DohvatiCHC.forEach(c => {
    if (c.checked == true) {
      nizCena.push(c.value)
      ubacivanje("cena", c.value);
    }
  });
  if (nizCena.length == 0) {
    filtriraniProizvodi = proizvodi;
  }
  else {
    var sortiraniNizCena = nizCena.sort(function (a, b) {
      return b - a;
    })
    filtriraniProizvodi = proizvodi.filter(proizvod => proizvod.cena.nova <= sortiraniNizCena[0])
  }
  return filtriraniProizvodi;
}
function sortiranje(nizProizvoda) {
  let sortiraniProizvodi = [];
  let izbor = $("#ddlSort").val();
  ubacivanje("sort", izbor);
  if (izbor == "0") {
    sortiraniProizvodi = nizProizvoda;
  }
  else {
    sortiraniProizvodi = nizProizvoda.sort(function (a, b) {
      if (izbor == "cena-asc") {
        return a.cena.nova - b.cena.nova;
      }
      if (izbor == "cena-desc") {
        return b.cena.nova - a.cena.nova;
      }
      if (izbor == "naziv-asc") {
        if (a.model < b.model) {
          return -1;
        }
        else if (a.model > b.model) {
          return 1;
        }
        else {
          return 0;
        }
      }
      if (izbor == "naziv-desc") {
        if (a.model > b.model) {
          return -1;
        }
        else if (a.model < b.model) {
          return 1;
        }
        else {
          return 0;
        }
      }
      if (izbor == "ocena") {
        if (a.ocenaid > b.ocenaid) {
          return -1;
        }
        else if (a.ocenaid < b.ocenaid) {
          return 1;
        }
        else {
          return 0;
        }
      }
    })
  }
  return sortiraniProizvodi;
}
function filtrirajPoNazivu(proizvodi) {
  let vrednostPolja = $("#search").val().trim().toLowerCase();
  ubacivanje("search", vrednostPolja);
  if (vrednostPolja.length <= 3) {
    return proizvodi;
  }
  return proizvodi.filter(proizvod => proizvod.model.toLowerCase().includes(vrednostPolja));
}
function promena() {
  var proizvodi = dohvatanje("sviProizvodi");
  console.log(proizvodi);
  if (window.location.pathname == "/VinylShop/index.html") {

    proizvodi = proizvodi.filter(product => product.new == true);
    console.log(proizvodi);
  }
  proizvodi = filtriranje(proizvodi, "brend", "brandId");
  proizvodi = filtriranje(proizvodi, "popust", "popustId");
  proizvodi = filtriranjeCena(proizvodi);
  proizvodi = filtriranje(proizvodi, "ocena", "ocenaid");
  proizvodi = sortiranje(proizvodi);
  proizvodi = filtrirajPoNazivu(proizvodi);
  ispisProizvoda(proizvodi);
  const toggleButtons = document.querySelectorAll('.toggleButton1');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productDetails = button.parentElement.querySelector('.product-details');
      productDetails.classList.toggle('active');
    });
  });
  let dugmici = document.querySelectorAll('.korpa')
  console.log(dugmici);

  dugmici.forEach(dugme => {
    dugme.addEventListener('click', function (e) {
      e.preventDefault();
      if (dohvatanje("korpa") != null) {
        let korpa = dohvatanje("korpa");
        let br = 0;
        for (let i of korpa) {
          if (i.id == this.getAttribute("data-proizvodid")) {
            br++;
          }
        }
        if (br > 0) {
          AddedToCartModal()
        }
        else {
          korpa.push({ "id": this.getAttribute("data-proizvodid"), "quantity": 1 });
          ubacivanje("korpa", korpa);

          AddedToCartModal("dodat")

        }

      }
    })
  })
}
function kreirajPadajucuListu(niz, idListe, labela, classDiv) {
  let html = `<div class="form-group" id="red">
		<h3 class="agileits-sear-head mb-3">${labela}</h3>
        <select class="form-select" id="${idListe}">
            <option value="0">Izaberite</option>`;
  for (let obj of niz) {
    html += `<option value="${obj.vrednost}">${obj.naziv}</option>`
  }
  html += `</select>
    </div>`;

  document.querySelector(`.${classDiv}`).innerHTML = html;
}
function ispisiNaziv(id, storage) {
  let nizLS = dohvatanje(storage);

  let naziv = "";
  for (let obj of nizLS) {
    if (obj.id == id) {
      naziv = obj.ime;
      break;
    }
  }
  return naziv;

}
function ispisPopust(nizZaIspis) {
  let popust = document.querySelector(".popust");
  let inputi = "";

  for (let obj of nizZaIspis) {
    if (obj.id == 0) {
      inputi += `<li>
        <input type="checkbox" class="checked" value="${obj.id}" />
        <span class="span">No discount</span>
        </li>`
    }
    else {
      inputi += `<li>
        <input type="checkbox" class="checked" value="${obj.id}" />
        <span class="span">${obj.ime}</span>
        </li>`
    }
  }

  popust.innerHTML = inputi;
}
function ispisCena(nizZaIspis) {
  let cena = document.querySelector(".cena");
  let inputi = "";

  for (let obj of nizZaIspis) {
    inputi += `<li>
        <input type="checkbox" class="checked" value="${obj.cenaDo}" />
        <span class="span">Do: ${obj.cenaDo}€</span>
        </li>`
  }

  cena.innerHTML = inputi;
}
function ispisBrendova(nizZaIspis) {
  let brendIspis = document.querySelector(".brand");
  let inputi = "";

  for (let obj of nizZaIspis) {
    inputi += `<li>
        <input type="checkbox" name="Brendovi" class="checked" value="${obj.id}">
        <span class="span">${ispisiNaziv(obj.id, "savBrend")}</span>
        </li>`
  }

  brendIspis.innerHTML = inputi;
}
function ispisOcena(nizZaIspis) {
  let ocena = document.querySelector(".ocena");
  let inputi = "";
  inputi += `<li>`
  var star = 0;
  for (let obj of nizZaIspis) {
    star++;

    for (let i = 0; i < star; i++) {
      inputi += `<i class="fas fa-star"></i>`
    }
    inputi += `
        <input type="checkbox" name="Ocena" class="checked" value="${obj.id}">
        
        <span>${obj.zvezdice}</span></br>`
  }
  inputi += `</li>`;
  ocena.innerHTML = inputi;
}
function ispisProizvoda(nizZaIspis) {
  let sviProizvodi = document.querySelector("#proizvodi");
  let proizvod = "";
  if (nizZaIspis.length == 0) {
    proizvod += `<h3 id="PorukaNema">There are currently no products for the given criteria.</h3>`
  }
  else {
    for (let obj of nizZaIspis) {
      var ocena = "";
      for (var i = 0; i < obj.ocenaid; i++) {
        ocena += `<i class="fas fa-star"></i>`;
      }
      var specIspis = "";
      for (var i of obj.specifikacije) {
        if (i.vrednost == 1) {
          specIspis += i.ime + "\n ";
        }
      }
      if (obj.new) {
        var New = "NEW!"
        proizvod += `
            <div class="col-md-4 product-men mt-5">
                <div class="men-pro-item simpleCart_shelfItem">
                    <div class="men-thumb-item text-center">
                        <div class="img-product">
                            <div class="discount-sticker">${New}</div>
                            <img src="${obj.slike.slika1}" alt="${obj.slike.alt}" class="initial-img" />
                        </div>
                        <div class="OpisProizvoda">
                            <div class="product-details">
                                <p>${ispisiNaziv(obj.brandId, "savBrend")}-${obj.model}</p>
                                <p>${obj.boja}</p>
                                <p>Year :${obj.godina}</p>
                                <p>${ispisiNaziv(obj.genreId, "savRam")}/${specIspis}</p>
                                <p>${obj.sistem}-${obj.boja}</p>
                                <p>${specIspis}</p>
                                <p>${ocena}</p>
                            </div>
                            <input type="button" class="toggleButton1" value="About" />
                        </div> 
                    </div>
                    <div class="item-info-product text-center border-top mt-4">
                        <div class="info-product-price my-2 similar-block">
                            <span class="item_price">${obj.model}</span></br>
                            <span class="item_price">${ispisiNaziv(obj.popustId, "savPopust")}  ${obj.cena.nova}</span>
                            <del>${obj.cena.stara}</del>
                        </div>
                        <div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
                            <form action="" method="">
                                <button class="button btn korpa" data-proizvodid="${obj.id}">Add to cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            `
      }
      else {
        proizvod += `
            <div class="col-md-4 product-men mt-5">
                <div class="men-pro-item simpleCart_shelfItem">
                    <div class="men-thumb-item text-center">
                        <div class="img-product">
                            <img src="${obj.slike.slika1}" alt="${obj.slike.alt}" class="initial-img" />
                        </div>
                        <div class="OpisProizvoda">
                            <div class="product-details">
                                <p>${ispisiNaziv(obj.brandId, "savBrend")}-${obj.model}</p>
                                <p>${obj.boja}-${obj.ekran}</p>
                                <p>${ispisiNaziv(obj.genreId, "savRam")}/${obj.memorija}</p>
                                <p>${obj.kamera}</p>
                                <p>${obj.sistem}-${obj.procesor}</p>
                                <p>${specIspis}</p>
                                <p>${ocena}</p>
                            </div>
                            <input type="button" class="toggleButton1" value="About" />
                        </div> 
                    </div>
                    <div class="item-info-product text-center border-top mt-4">
                        <div class="info-product-price my-2 similar-block">
                            <span class="item_price">${obj.model}</span></br>
                            <span class="item_price">${ispisiNaziv(obj.popustId, "savPopust")}  ${obj.cena.nova}</span>
                            <del>${obj.cena.stara}</del>
                        </div>
                        <div class="snipcart-details top_brand_home_details item_add single-item hvr-outline-out">
                            <form action="" method="">
                                <button class="button btn korpa" data-proizvodid="${obj.id}">Add to cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            `
      }
    }
  }
  sviProizvodi.innerHTML = proizvod;
}
function AddedToCartModal(tip) {
  let small_modal = document.querySelector(".small-modal");
  let small_modal_value = document.querySelector(".small-modal-content p");
  small_modal_value.textContent = "";
  if (tip == "dodat") {
    small_modal_value.textContent = "You have added the product to the cart"
    small_modal.classList.add("d-block");
    setTimeout(() => {
      small_modal.classList.remove("d-block");
    }, 1800);

  }
  else {
    small_modal_value.textContent = "Product already in cart"
    small_modal.classList.add("d-block");
    setTimeout(() => {
      small_modal.classList.remove("d-block");

    }, 1800);
  }
}
function ispisProizvodaKorpa() {

  var proizvodi = dohvatanje("sviProizvodi");
  let korpa = dohvatanje("korpa")
  var korpaDiv = document.querySelector(".korpaIspis");
  let html = "";
  let idK = 0;
  var totalCena = 0;
  if (korpa.length == 0) {
    document.querySelector(".checkout-left").innerHTML = "";
    document.querySelector(".tableFooter").innerHTML = "";
    document.querySelector(".tableHead").innerHTML = "";
  }
  else if (korpa.length > 0) {

    for (let i of proizvodi) {
      for (let j of korpa) {
        if (i.id == j.id) {
          totalCena += i.cena.nova * j.quantity;
          html += `<tr class="rem1">
                <td class="invert">${++idK}</td>
                <td class="invert-image">
                    <a href="single.html">
                        <img src="${i.slike.slika1}" alt="${i.slike.alt}" class="img-responsive" />
                    </a>
                </td>
                <td class="invert">
                    <div class="quantity">
                        <div class="quantity-select">
                            <div class="entry value-minus" data-id="${i.id}">&nbsp;</div>
                            <div class="entry value">
                                <span>${j.quantity}</span>
                            </div>
                            <div class="entry value-plus" data-id="${i.id}">&nbsp;</div>
                        </div>
                    </div>
                </td>
                <td class="invert">${i.model}</td>
                <td class="invert" id="sirina"><span class="ukupnaCena">${i.cena.nova * j.quantity}$</span></td>
                <td class="invert">
                    <div class="rem">
                        <div class="close1" data-closeid="${i.id}"> </div>
                    </div>
                </td>
            </tr>`;
        }
      }
    }

    document.getElementById("TotalCena").innerHTML = "Total: " + totalCena + "$";
    ubacivanje("total", totalCena)

    korpaDiv.innerHTML = html;
  }
}
if (window.location.pathname == "/VinylShop/index.html" || window.location.pathname == "/VinylShop/checkout.html" || window.location.pathname == "/VinylShop/product.html") {

  ajaxCallBack("brend.json", function (rezultatBrend) {
    ubacivanje("savBrend", rezultatBrend);
    ispisBrendova(rezultatBrend);
  })
  ajaxCallBack("popust.json", function (rezultatPopust) {
    ispisPopust(rezultatPopust);
    ubacivanje("savPopust", rezultatPopust);
  })
  ajaxCallBack("ocena.json", function (rezultatOcena) {
    ispisOcena(rezultatOcena);
  })
  ajaxCallBack("cena.json", function (rezultatCena) {
    ispisCena(rezultatCena);
  })
  ajaxCallBack("genre.json", function (rezultatRam) {
    ubacivanje("savRam", rezultatRam);

  })

  ajaxCallBack("sortiranje.json", function (rezultatSortiranje) {
    kreirajPadajucuListu(rezultatSortiranje, "ddlSort", "Sort", "sortiranje", "sort");
  })
  if (window.location.pathname == "/VinylShop/index.html") {
    ajaxCallBack("proizvodi.json", function (rezultatProizvoda) {
      var rez = [];
      rezultatProizvoda.forEach(element => {
        if (element.new) {
          rez.push(element);
        }


      });
      ispisProizvoda(rez);
      ubacivanje("sviProizvodi", rezultatProizvoda);
    })
  }
  if (window.location.pathname == "/VinylShop/product.html") {
    ajaxCallBack("proizvodi.json", function (rezultatProizvoda) {

      ispisProizvoda(rezultatProizvoda);
      ubacivanje("sviProizvodi", rezultatProizvoda);
    })
  }

  $(window).on('load', function () {

    setTimeout(() => {



      let dugmici = document.querySelectorAll('.korpa')
      console.log(dugmici);

      dugmici.forEach(dugme => {
        dugme.addEventListener('click', function (e) {
          e.preventDefault();
          if (dohvatanje("korpa") != null) {
            let korpa = dohvatanje("korpa");
            let br = 0;
            for (let i of korpa) {
              if (i.id == this.getAttribute("data-proizvodid")) {
                br++;
              }
            }
            if (br > 0) {
              AddedToCartModal()
            }
            else {
              korpa.push({ "id": this.getAttribute("data-proizvodid"), "quantity": 1 });
              ubacivanje("korpa", korpa);

              AddedToCartModal("dodat")

            }

          }
        })
      })
      let chcD = document.querySelectorAll(".brand input");

      chcD.forEach(c => {
        c.addEventListener("change", function () {
          promena();
        })

      });
      let chc2 = document.querySelectorAll(".popust input");

      chc2.forEach(c => {
        c.addEventListener("change", function () {
          promena();
        })

      });
      let chc = document.querySelectorAll(".cena input");

      chc.forEach(c => {
        c.addEventListener("change", function () {
          promena();
        })

      });
      let chc1 = document.querySelectorAll(".ocena input");

      chc1.forEach(c => {
        c.addEventListener("change", function () {
          promena();
        })

      });
      document.querySelector("#search").addEventListener("keyup", function () {
        promena();
      })

      $(document).on("change", "#ddlSort", promena);

      const toggleButtons = document.querySelectorAll('.toggleButton1');

      toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
          const productDetails = button.parentElement.querySelector('.product-details');
          productDetails.classList.toggle('active');
        });
      });

    }, 2000);
  });

}
if (window.location.pathname == "/VinylShop/contact.html" || window.location.pathname == "/VinylShop/checkout.html") {
  const fullName = document.getElementById('name');
  const email = document.getElementById('email');
  const change = document.getElementById('change');
  const message = document.getElementById('message');
  const checkBox = document.getElementById('agree');
  const submit = document.getElementById('submit');
  var errorMessages = document.querySelectorAll('#form span');

  var nameChc = false;
  var emailChc = false;
  var selectChc = false;
  var messageChc = false;
  var checkBoxChc = false;

  var nameRegex = /^[A-ZČĆŽĐŠ][a-zćčžđš]{1,14}\s([A-ZČĆŽĐŠ][a-zćčžđš]{1,14})?\s?[A-ZČĆŽŠĐ][a-zćčžđš]{1,19}$/;
  var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //Check name

  function checkName() {
    if (fullName.value.match(nameRegex)) {
      fullName.classList.remove('fail')
      fullName.classList.add('success');
      errorMessages[1].textContent = "";
      nameChc = true;
    } else if (fullName.value.length < 1) {
      errorMessages[1].textContent = "Field can't be empty.";
      nameChc = false;
    } else {
      errorMessages[1].textContent = "Change the format of the name. Example: Pera Peric";
      nameChc = false;
    }
  }

  fullName.addEventListener('focus', () => {
    fullName.classList.add('fail');
  });

  fullName.addEventListener('blur', checkName);

  //Check email

  function checkEmail() {
    if (email.value.match(emailRegex)) {
      email.classList.remove('fail')
      email.classList.add('success');
      errorMessages[3].textContent = "";
      emailChc = true;
    } else if (email.value.length < 1) {
      errorMessages[3].textContent = "Field can't be empty.";
      emailChc = false;
    } else {
      errorMessages[3].textContent = "Change the format of the email. Example: someone@gmail.com";
      emailChc = false;
    }
  }

  email.addEventListener('focus', () => {
    email.classList.add('fail');
  });

  email.addEventListener('blur', checkEmail);

  //Message check


  function checkMessage() {
    if (message.value < 1) {
      errorMessages[5].textContent = "Field can't be empty.";
      message.classList.add('fail');
      messageChc = false;
    } else {
      errorMessages[5].textContent = "";
      message.classList.remove('fail');
      message.classList.add('success');
      messageChc = true;
    }
  }

  message.addEventListener('blur', checkMessage);

  //Checkbox check

  function checkCheckbox() {
    if (checkBox.checked) {
      checkBoxChc = true;
      errorMessages[7].textContent = "";
    } else {
      errorMessages[7].textContent = "You have to agree in order to send.";
    }
  }

  function checkChange() {
    let selectedValue = change.options[change.selectedIndex].value;
    if (selectedValue == 0) {
      change.classList.add('fail');
      errorMessages[9].textContent = "Please choose the person you want";
      selectChc = false;
    } else {
      change.classList.remove('fail');
      change.classList.add('success');
      errorMessages[9].textContent = "";
      selectChc = true;
    }
  }
  change.addEventListener('blur', checkChange);

  //Submit check
  var korpa = dohvatanje("korpa")
  addEventListener('submit', (e) => {
    e.preventDefault();
    checkName();
    checkEmail();
    checkMessage();
    checkCheckbox();
    checkChange();
    if (nameChc && emailChc && messageChc && checkBoxChc && selectChc) {
      console.log("usao");
      if (window.location.pathname == "checkout.php" && korpa.length > 0) {
        var okModal = document.getElementById("okModal");
        var modal = document.getElementById("myModal");

        modal.style.display = "block";

        okModal.onclick = function () {
          modal.style.display = "none";
          setTimeout("location.reload(true);", 0);
        };
      }
      else if (nameChc && emailChc && messageChc && checkBoxChc && selectChc && window.location.pathname == "checkout.php" && korpa.length == 0) {
        console.log("usao2");
        var okModal = document.getElementById("okModal2");
        var modal = document.getElementById("myModal2");

        modal.style.display = "block";

        okModal.onclick = function () {
          modal.style.display = "none";
          window.location.href = "shop.php";
        };
      }
    }


  });
}
if (window.location.pathname == "/VinylShop/checkout.html") {
  ispisProizvodaKorpa();
  function ispisBroj(korpa) {
    var korpa = dohvatanje("korpa")
    var broj = document.querySelector(".brojProizvoda");
    var br = korpa.length;
    broj.innerHTML = `<h4 class="mb-sm-4 mb-3">Your shopping cart contains:
    <span>${br} Products</span></h4>`
  }
  var korpa = dohvatanje("korpa");
  ispisBroj(korpa);
  $(document).on("click", ".value-plus", dodaj)
  $(document).on("click", ".value-minus", oduzmi)
  function dodaj() {
    var korpa = dohvatanje("korpa");
    var quantity = this.parentElement.children[1].children[0].innerHTML;
    quantity = parseInt(quantity);
    quantity++;
    this.parentElement.children[1].children[0].innerHTML = quantity;
    var PocetnaCena = this.parentElement.parentElement.parentElement.parentElement.children[4].children[0].innerHTML;
    PocetnaCena = parseInt(PocetnaCena)
    var cena = PocetnaCena / (quantity - 1);
    cena *= quantity;

    this.parentElement.parentElement.parentElement.parentElement.children[4].children[0].innerHTML = cena + "$";
    let pomocni_niz = [];
    korpa.forEach(e => {

      if (e.id == this.getAttribute("data-id")) {
        e.quantity = quantity;
        pomocni_niz.push(e)
      }
      else {
        pomocni_niz.push(e)
      }

    });
    ubacivanje("korpa", pomocni_niz)
    ispisProizvodaKorpa();
    // ubacivanje("korpa",pomocni_niz)


  }
  function oduzmi() {
    var quantity = this.parentElement.children[1].children[0].innerHTML;
    quantity = parseInt(quantity);
    if (quantity > 1) {
      quantity--;
      this.parentElement.children[1].children[0].innerHTML = quantity;
      var PocetnaCena = this.parentElement.parentElement.parentElement.parentElement.children[4].children[0].innerHTML;
      PocetnaCena = parseInt(PocetnaCena)
      var cena = PocetnaCena / (quantity + 1);
      cena *= quantity;

      this.parentElement.parentElement.parentElement.parentElement.children[4].children[0].innerHTML = cena + "$";
      let pomocni_niz = [];
      korpa.forEach(e => {

        if (e.id == this.getAttribute("data-id")) {
          e.quantity = quantity;
          pomocni_niz.push(e)
        }
        else {
          pomocni_niz.push(e)
        }

      });
      ubacivanje("korpa", pomocni_niz)
      ispisProizvodaKorpa();

    }
  }
  $(document).on("click", ".close1", brisanje)
  function brisanje() {
    let id = $(this).data("closeid");
    let pom = [];
    let proizvodiKorpe = JSON.parse(localStorage.getItem("korpa"));
    pom = proizvodiKorpe.filter((e) => {
      return e.id != id;
    });
    ubacivanje("korpa", pom);

    if (pom.length == 0) {

      document.querySelector("#tabelaKorpa").innerHTML = "";
      document.querySelector(".brojProizvoda").innerHTML = `<h4 class="mb-sm-4 mb-3">Your shopping cart contains:
    <span>0 Products</span></h4>`;
      location.reload(true);

    }
    else {

      ispisProizvodaKorpa()
      ispisBroj(pom)
    }

  }
  function BrisanjeKorpa(div) {
    $(div).on("click", function () {
      ubacivanje("korpa", []);
      document.querySelector("#tabelaKorpa").innerHTML = "";
      document.querySelector(".brojProizvoda").innerHTML = `<h4 class="mb-sm-4 mb-3">Your shopping cart contains:
    <span>0 Products</span></h4>`;
      location.reload(true);



    })
  }
  BrisanjeKorpa("#BrisanjeSvega");
  BrisanjeKorpa("#okModal");






}