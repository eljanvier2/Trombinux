export const theme = {
    light: {
      primaryColor: '#EBEBEB',
      secondaryColor: '#9DA9D2',
      thirdColor: '#4D61A8',
      fourthColor: '#2D3861',
      textColor: '#333',
      isDark: false,
    },
    dark: {
      primaryColor: '#2D3861',
      secondaryColor: '#4D61A8',
      thirdColor: '#9DA9D2',
      fourthColor: '#EBEBEB',
      textColor: '#FFF',
      isDark: true,
    },
  };
  
  export const getCurrentTheme = isDark => (isDark ? theme.dark : theme.light);

  
  

