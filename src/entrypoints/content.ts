export default defineContentScript({
  matches: ['<all_urls>', 'file:///*'],
  main() {
    console.log('Hello content.');
  },
});
