import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header 
      userName="Alex Morgan"
      onProfileClick={() => console.log('Profile clicked')}
      onSettingsClick={() => console.log('Settings clicked')}
    />
  );
}
