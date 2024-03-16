// const staticCacheName = 's-app-v1';

const assets = [
  '/',
  '/index.html',
  '/assets/js/ui.js',
  '/assets/js/app.js',
  '/assets/js/ot.js',
  '/assets/js/data.js',
  '/assets/js/econs_added.js',
  '/assets/js/settings.js',
  '/assets/js/otmaxim.js',
  '/assets/js/micro5.js',
  '/assets/js/micro6.js',
  '/assets/js/newBases.js',
  '/assets/images/logo-192x192.png',
  '/assets/images/logo-512x512.png',
  '/assets/images/maskable_icon.png', 
  '/favicon.png',
  '/sw.js',
  '/assets/css/main.css',  
  '/assets/css/theme.css', 
  'https://fonts.googleapis.com/css?family=Lato:300,400,700',
];

// // install event
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       console.log('caching shell assets');
//       cache.addAll(assets);
//     })
//   );

  
// });

// // fetch event
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(cacheRes => {
//       return cacheRes || fetch(event.request);
//     })
//   );
// });

// self.addEventListener('activate',  event => {
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames
//           .filter(name => name !== staticCacheName)
//           .map(name => caches.delete(name))
//       );
//     })
//   );
// });


//////////////////////////////////////////

const CACHE_NAME = 'cache2';
self.addEventListener('install', async event => {
    console.log('install',event);
    // Открываем кеш и получаем объект кеша
    // объекты кеша могут хранить ресурсы
    const cache = await caches.open(CACHE_NAME);
    // Ждем добавления
    await cache.addAll(assets);
    await self.skipWaiting();
});

// Удаляем старый кеш при активации
self.addEventListener('activate', async event => {
    // Получаем все ключи кеша
    const keys = await caches.keys();
    keys.forEach(key => {
        // Если имя кеша отличается от текущего имени
        // удаляем кеш
        if(key !== CACHE_NAME){
            caches.delete(key)
        }
    })
    await self.clients.claim();
});


// Определяем, успешен ли запрос ресурса
// Успех -> Ответ на успешный результат
// не удалось -> прочитать кешированный контент
self.addEventListener('fetch', event => {
   const req = event.request
   // отвечаем браузеру
   event.respondWith(networkFirst(req))
});

// Сначала сеть
async function networkFirst(req){
    try{
        // Сначала получаем самые свежие ресурсы из сети
        // Запрос может завершиться неудачно, попробуйте
        // Если есть сеть, запрос успешен, используем запрошенные данные
        const fresh = await fetch(req)
        return fresh
    }catch(e){
        // Когда сети нет, запрос не выполняется и используются кешированные данные
        const cache = await caches.open(CACHE_NAME)
        // Сопоставить результат, соответствующий req в кеше
        const cached = await cache.match(req)
        return cached
    }

}


