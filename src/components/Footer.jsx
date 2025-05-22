function Footer() {
    return (
      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} TTRPG Toolbox. All rights reserved.</p>
        </div>
      </footer>
    )
  }
  
  export default Footer