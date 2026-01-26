
browser.storage.onChanged.addListener((changes, area) => {
    if (area == 'local' && 
        ('distance' in changes || 'delay' in changes)
    ) {
        update(changes.distance.newValue);
        // console.log('changes registered');
    }
});

// function update()