const req = require('./request')
const cheerio = require('cheerio')
const database = require('../serieservice')
var pagina = 1


// async function episodes () {
//   let body = await req.get(`http://www.thenightseries.net/category/acao/page/${pagina}/`)
//   console.log(pagina)
//   var $ = cheerio.load(body)

//   let numeroEpisodios = $('.lista-filmes').find('li').length
//   if (numeroEpisodios <= 0) {
//     database.add(series, (err, result) => {
//       console.log(result)
//       return console.log(series.length)
//     })
//   }

//   for (let i = 0; i < numeroEpisodios; i++) {
//      let serie = {
//        nome: $('.lista-filmes').find('li').eq(i).find('.titulo-box').text().trim(),
//        url: $('.lista-filmes').find('li').eq(i).find('.titulo-box').find('a').eq(0).attr('href'),
//        capa: $('.lista-filmes').find('li').eq(i).find('.capa').eq(0).find('img').eq(0).attr('src')
//      }
//      let _serie = await infoSerie(serie)
 
//      series.push(_serie)
 
//      if (i + 1 === numeroEpisodios) {
//        pagina++
//        return episodes()
//      }
//    }
// }

// async function infoSerie (serie) {
//   // console.log(serie)
//   let body = await req.get(serie.url)

//   return new Promise((resolve, reject) => {
//     const $ = cheerio.load(body)

//     // let numeroEpisodios = $('.tab_content').find('li').length
//     let episodios = []
//     serie.duracao = $('.tempo-video').text().trim()
//     serie.lancamento = $('.lancamento-video').eq(0).text().trim()
//     serie.emissora = $('.lancamento-video').eq(1).text().trim()
//     serie.audio = $('.audio-video').text().trim()
//     $('.tab_content').find('li').each(function (i, elem) {
//       let disponivel = $(this).text().trim().toUpperCase()
//       if (disponivel !== 'NÃO DISPONÍVEL') {
//         episodios.push({
//           nome: `${$(this).find('a').text().trim()}`,
//           complete: `${$(this).find('a').attr('title').trim()}`,
//           url_video: $(this).find('a').attr('href').trim()
//         })
//         // console.log(serie)
//         // console.log($(this).find('a').text().trim())
//       }
//       if (i + 1 === $('.tab_content').find('li').length) {        
//         serie.episodios = episodios
//         // console.log(serie.episodios)
//         return resolve(serie)
//       }
//     })
//   })
// }

async function Series () {
  return new Promise((resolve, reject) => {
    database.get({}, (err, doc) => {
      return resolve(doc[0].series)
    })
  })
}

async function episodeURL(url) {
  if (url !== undefined) {
  let body = await req.get(url)
  const $ = cheerio.load(body)

  return new Promise((resolve, reject) => {
    return resolve($('iframe').eq(0).attr('src'))
  })
}
}

async function opcoesVideo(url) {
  if (url !== undefined) {
  let body = await req.get(url)
  const $ = cheerio.load(body)

  return new Promise((resolve, reject) => {
    let opcoes = []
    $('.itens').find('a').each(function (i, elem) {
        opcoes.push({
          nome: $(this).text().trim(),
          url: $(this).attr('onclick') !== undefined ? $(this).attr('onclick').replace('location.href=', '').replace(/\'/g, '').replace(/;/g, '') : $(this).attr('download')
        })
    })
    // console.log(opcoes)
    return resolve(opcoes)
  })
}
}

async function videoSource (opcoes, cb) {
  let videos = []
  for (let i = 0; i < opcoes.length; i++) {
    if (opcoes[i].url !== undefined) {

    let body = await req.get(opcoes[i].url)
    const $ = cheerio.load(body)

    // console.log($('video').length)
    // console.log(opcoes[i].url)
    // return new Promise((resolve, reject) => {
      
        videos.push({
          opcao: opcoes[i].nome,
          imagem: $('video').attr('poster'),
          source: $('video').find('source').eq(0).attr('src')
        })
        if (i+1 === opcoes.length) {
          return cb(null, videos)
        }
    // })
      
    }
  }
}

async function episodes () {
  var series = await Series()
  for (let i = 7; i < series.length; i++) {
    for (let j = 0; j < series[i].episodios.length; j++) {
      let epURL = await episodeURL(series[i].episodios[j].url_video)
      let opcoes = await opcoesVideo(epURL)
      let videos = await videoSource(opcoes, (err, _videos) => {
        console.log(i)
        console.log(j)
        console.log(series[i].episodios[j].complete)
        database.update(series[i].nome, j, _videos)

        if (j+1 === series[i].episodios.length) {
          console.log('terminou', series[i].nome)
        }
      })
      // console.log(videos)
      // console.log(episodio.nome)
      // console.log(episodio.url_video)
    }
  }
}

episodes()
// {"nome":"Constantine","url":"http://www.thenightseries.net/constantine/","capa":"https://image.tmdb.org/t/p/w600_and_h900_bestv2/ajInpZ2BH6rf8tTdvgbhi09tCGg.jpg","duracao":"Tempo: 42 min","lancamento":"Lançamento: 2014","emissora":"Emissora: NBC","audio":"Áudio: Dublado e Legendado","episodios":['TOP']}
// database.update('Constantine')