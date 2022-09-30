function scrollHorizontally(sticky, sticky_parent) {
    const scroll_width = sticky.scrollWidth
    const vertical_scroll_height = sticky_parent.getBoundingClientRect().height - sticky.getBoundingClientRect().height
    const scroll_ratio = scroll_width / vertical_scroll_height
    let sticky_position = sticky.getBoundingClientRect().top 
    
    // Checking whether the sticky element has entered into view or not
    if (sticky_position > 1) {
        return
    } else {
        sticky.scrollLeft = scroll_ratio * window.scrollY * 0.77
    }
}

export default scrollHorizontally