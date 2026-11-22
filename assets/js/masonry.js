(() => {
    if (!('ResizeObserver' in window)) {
        return;
    }

    function arrangeMasonry(grid, items) {
        const layout = getComputedStyle(grid);
        const columns = layout.gridTemplateColumns.split(/\s+/).map(parseFloat).filter(Number.isFinite);

        if (columns.length < 2 || grid.clientWidth === 0) {
            grid.classList.remove('is-masonry');
            return;
        }

        const columnGap = parseFloat(layout.columnGap) || 0;
        const rowGap = parseFloat(layout.rowGap) || 0;
        const columnWidth = columns[0];
        const columnHeights = columns.map(() => 0);

        grid.style.setProperty('--masonry-item-width', `${columnWidth}px`);
        grid.classList.add('is-masonry');

        // Measure the photos and captions at their column width before positioning any item.
        const itemHeights = items.map((item) => item.getBoundingClientRect().height);

        for (const [index, item] of items.entries()) {
            const top = Math.min(...columnHeights);
            const column = columnHeights.indexOf(top);
            const inlineOffset = column * (columnWidth + columnGap);

            item.style.setProperty('--masonry-top', `${top}px`);
            item.style.setProperty('--masonry-inline-offset', `${inlineOffset}px`);
            columnHeights[column] = top + itemHeights[index] + rowGap;
        }

        grid.style.setProperty('--masonry-height', `${Math.max(...columnHeights) - rowGap}px`);
    }

    const grids = document.querySelectorAll('.work-grid, .expedition-body .gallery');

    for (const grid of grids) {
        const items = [...grid.children];

        if (items.length < 2) {
            continue;
        }

        let frame = 0;
        const observer = new ResizeObserver(() => {
            if (frame) {
                return;
            }

            frame = requestAnimationFrame(() => {
                frame = 0;
                arrangeMasonry(grid, items);
            });
        });

        observer.observe(grid);
        for (const item of items) {
            observer.observe(item);
        }

        arrangeMasonry(grid, items);
    }
})();
